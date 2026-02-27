import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Strict input validation (Rule 3)
const verifyOtpSchema = z.object({
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
    otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = verifyOtpSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input parameters' }, { status: 400 });
        }

        const { phone, otp } = result.data;

        // 1. Verify OTP against the database
        // Find the most recent OTP for this phone that was generated in the last 5 minutes
        const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

        const { data: otpRecords, error: otpError } = await supabase
            .from('otp_requests')
            .select('*')
            .eq('phone', phone)
            .eq('otp', otp)
            .gte('created_at', fiveMinsAgo)
            .order('created_at', { ascending: false })
            .limit(1);

        if (otpError || !otpRecords || otpRecords.length === 0) {
            return NextResponse.json(
                { error: 'Invalid or expired OTP' },
                { status: 401 } // 401 Unauthorized
            );
        }

        // Optional: Mark OTP as used or delete it to prevent replay attacks
        await supabase.from('otp_requests').delete().eq('id', otpRecords[0].id);

        // 2. Lookup or Create User in DB to get their Role & ID
        let { data: user, error: userError } = await supabase
            .from('users')
            .select('id, role')
            .eq('phone', phone)
            .single();

        // If no user exists, we might implicitly register them as a customer
        if (!user) {
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert([{ phone: phone, role: 'customer' }])
                .select('id, role')
                .single();

            if (createError || !newUser) {
                return NextResponse.json({ error: 'Error provisioning user' }, { status: 500 });
            }
            user = newUser;
        }

        // 3. Generate Secure Session Token (JWT)
        const jwtSecret = process.env.JWT_SECRET || 'fallback_development_secret_key_123!';

        // Mute the console error to keep logs clean since we have a fallback
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role, // 'customer' or 'admin'
            },
            jwtSecret,
            { expiresIn: '7d' } // Token expires in 7 days
        );

        // 4. Secure Session Storage (HttpOnly Cookie)
        // NEVER RETURN THE JWT IN JSON BODY. Standard localStorage is vulnerable to XSS.

        // Explicitly awaiting cookies() in Next.js 15+
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'auth_session',
            value: token,
            httpOnly: true,  // Invisible to JavaScript (XSS Protection)
            secure: process.env.NODE_ENV === 'production', // Only sent over HTTPS in production
            sameSite: 'strict', // CSRF Protection: Only sent on requests originating from the same site
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        });

        // 5. Respond with simple success indicator (Notice: No JWT here!)
        return NextResponse.json({
            success: true,
            role: user.role
        }, { status: 200 });

    } catch (error: any) {
        console.error("OTP verification error:", error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}
