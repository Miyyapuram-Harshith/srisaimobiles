import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Mock Admin Verification (In production, verify against Supabase 'users' table)
        if (email === 'admin@srisaimobiles.com' && password === 'admin123') {
            const jwtSecret = process.env.JWT_SECRET || 'fallback_development_secret_key_123!';

            if (!jwtSecret) {
                console.error("Missing JWT_SECRET environment variable");
                return NextResponse.json({ error: 'Internal configuration error' }, { status: 500 });
            }

            // 1. Generate Secure Admin Token (JWT)
            const token = jwt.sign(
                {
                    userId: 'admin-mock-id',
                    role: 'admin', // The middleware strictly checks for 'admin' or 'super_admin'
                },
                jwtSecret,
                { expiresIn: '1d' }
            );

            // 2. Set HttpOnly Cookie (Crucial for Edge Middleware RBAC)
            const cookieStore = await cookies();
            cookieStore.set({
                name: 'auth_session',
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 24 * 60 * 60, // 1 day
            });

            return NextResponse.json({ success: true, role: 'admin' }, { status: 200 });
        }

        return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });

    } catch (error: any) {
        console.error("Admin login error:", error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}
