import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import crypto from 'crypto';

// 1. Strict Input Sanitization
const sendOtpSchema = z.object({
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
});

// Initialize Supabase with Service Role to securely interact with the DB
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 2. Validate input
        const result = sendOtpSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid phone number' },
                { status: 400 }
            );
        }

        const { phone } = result.data;
        const ip = request.headers.get('x-forwarded-for') || 'unknown';

        // 3. Strict Rate Limiting (SMS Bombing Prevention)
        // Query how many OTPs this phone/IP requested in the last 15 minutes
        const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

        // We check both the IP and the Phone to prevent abuse
        const { data: recentRequests, error: countError } = await supabase
            .from('otp_requests')
            .select('id')
            .or(`phone.eq.${phone},ip_address.eq.${ip}`)
            .gte('created_at', fifteenMinsAgo);

        if (countError) {
            console.error("Database error checking rate limit:", countError);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }

        // "A single IP address or phone number can only request an OTP 3 times every 15 minutes."
        if (recentRequests && recentRequests.length >= 3) {
            console.warn(`Rate limit exceeded for phone ${phone} or IP ${ip}`);
            return NextResponse.json(
                { error: 'Too many requests. Please try again after 15 minutes.' },
                { status: 429 } // 429 Too Many Requests
            );
        }

        // 4. Generate a Secure 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // 5. Log the record into the database
        const { error: insertError } = await supabase
            .from('otp_requests')
            .insert([
                {
                    phone: phone,
                    otp: otp, // In a real prod environment, you might hash this before saving!
                    ip_address: ip,
                    created_at: new Date().toISOString()
                }
            ]);

        if (insertError) {
            console.error("Database error inserting OTP:", insertError);
            return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 });
        }

        // 6. Trigger SMS Gateway (Mocked)
        console.log(`[MOCK SMS] Sending OTP ${otp} to phone ${phone}`);

        return NextResponse.json({ success: true, message: 'OTP sent successfully' }, { status: 200 });

    } catch (error: any) {
        console.error("OTP generation error:", error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
