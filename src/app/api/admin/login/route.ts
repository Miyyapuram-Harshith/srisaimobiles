import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// ── In-memory rate limiter (resets on server restart) ──────────────────────
// Tracks failed login attempts per IP: Map<ip, { count, firstAttemptAt }>
const loginAttempts = new Map<string, { count: number; firstAttemptAt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
    const now = Date.now();
    const record = loginAttempts.get(ip);

    if (!record) return { allowed: true, retryAfterSec: 0 };

    // Reset window if 15 minutes have passed since first attempt
    if (now - record.firstAttemptAt > LOCKOUT_WINDOW_MS) {
        loginAttempts.delete(ip);
        return { allowed: true, retryAfterSec: 0 };
    }

    if (record.count >= MAX_ATTEMPTS) {
        const retryAfterSec = Math.ceil((record.firstAttemptAt + LOCKOUT_WINDOW_MS - now) / 1000);
        return { allowed: false, retryAfterSec };
    }

    return { allowed: true, retryAfterSec: 0 };
}

function recordFailedAttempt(ip: string): void {
    const now = Date.now();
    const record = loginAttempts.get(ip);
    if (!record) {
        loginAttempts.set(ip, { count: 1, firstAttemptAt: now });
    } else {
        loginAttempts.set(ip, { ...record, count: record.count + 1 });
    }
}

function clearAttempts(ip: string): void {
    loginAttempts.delete(ip);
}

// ── Route Handler ────────────────────────────────────────────────────────────
export async function POST(request: Request) {
    // 1. Hard-fail if JWT_SECRET is not properly set (never use a fallback in prod)
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || jwtSecret.length < 32) {
        console.error('[SECURITY] JWT_SECRET is missing or too weak. Set a strong secret in .env.local');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 2. Get real client IP (works behind Vercel/Next.js edge proxies)
    const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        request.headers.get('x-real-ip') ||
        '127.0.0.1';

    // 3. Rate limit check
    const { allowed, retryAfterSec } = checkRateLimit(ip);
    if (!allowed) {
        console.warn(`[SECURITY] Rate limit exceeded for IP: ${ip}`);
        return NextResponse.json(
            { error: `Too many failed attempts. Try again in ${Math.ceil(retryAfterSec / 60)} minute(s).` },
            {
                status: 429,
                headers: {
                    'Retry-After': String(retryAfterSec),
                    'X-RateLimit-Limit': String(MAX_ATTEMPTS),
                    'X-RateLimit-Remaining': '0',
                },
            }
        );
    }

    try {
        const body = await request.json();
        const { email, password } = body;

        // 4. Basic input presence checks
        if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
            return NextResponse.json({ error: 'Invalid login details.' }, { status: 401 });
        }

        // 5. Load credentials from environment variables — never from source code
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
            console.error('[SECURITY] ADMIN_EMAIL or ADMIN_PASSWORD_HASH not set in environment. Check .env.local');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // 6. Constant-time email comparison (toLowerCase to prevent case enumeration)
        const emailMatches = email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
        
        console.log(`[DEBUG] Login attempt for: ${email.trim().toLowerCase()}`);
        console.log(`[DEBUG] Match Email: ${emailMatches} (Input len: ${email.trim().length}, Env len: ${adminEmail.trim().length})`);
        console.log(`[DEBUG] Hash loaded: ${adminPasswordHash.trim().substring(0, 10)}... (Hash len: ${adminPasswordHash.trim().length})`);

        // 7. Timing-safe bcrypt password comparison (always run even if email is wrong to prevent timing attacks)
        const passwordMatches = emailMatches ? await bcrypt.compare(password, adminPasswordHash.trim()) : false;
        console.log(`[DEBUG] Match Password: ${passwordMatches} (Input password len: ${password.length})`);

        if (!emailMatches || !passwordMatches) {
            recordFailedAttempt(ip);
            console.log(`[DEBUG] Auth failed for IP: ${ip}`);
            // Generic error prevents user enumeration
            return NextResponse.json({ error: 'Invalid login details.' }, { status: 401 });
        }

        // 8. Successful auth — clear failed attempts
        clearAttempts(ip);

        // 9. Issue signed JWT
        const token = jwt.sign(
            {
                userId: 'admin',
                role: 'admin',
                iat: Math.floor(Date.now() / 1000),
            },
            jwtSecret,
            { expiresIn: '1d', algorithm: 'HS256' }
        );

        // 10. Set secure HttpOnly cookie
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

    } catch (error: any) {
        console.error('[ERROR] Admin login error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}
