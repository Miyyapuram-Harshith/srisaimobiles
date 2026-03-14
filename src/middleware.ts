import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Protect admin UI pages + all admin API routes + write-only APIs
export const config = {
    matcher: [
        '/admin/:path*',
        '/api/admin/:path*',
        '/api/settings',
        '/api/upload',
    ],
};

export async function middleware(request: NextRequest) {
    try {
        const { pathname } = request.nextUrl;

        // Always allow the login endpoint through
        if (pathname === '/api/admin/login') {
            return NextResponse.next();
        }

        // For /api/settings GET — public read is fine (homepage SSR needs it)
        if (pathname === '/api/settings' && request.method === 'GET') {
            return NextResponse.next();
        }

        // Require JWT_SECRET to be properly configured — never fall back silently
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret || jwtSecret.length < 32) {
            console.error('[SECURITY] JWT_SECRET is not set or too weak');
            if (pathname.startsWith('/api/')) {
                return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
            }
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Extract HttpOnly auth cookie
        const tokenCookie = request.cookies.get('auth_session');

        if (!tokenCookie?.value) {
            if (pathname.startsWith('/api/')) {
                return NextResponse.json({ error: 'Unauthorized: Login required' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Cryptographic token verification at the Edge
        const encodedSecret = new TextEncoder().encode(jwtSecret);
        const { payload } = await jwtVerify(tokenCookie.value, encodedSecret, {
            algorithms: ['HS256'],
        });

        const role = payload.role as string;

        // Strict RBAC — only admin/super_admin
        if (role !== 'admin' && role !== 'super_admin') {
            console.warn(`[SECURITY] Role '${role}' attempted access to ${pathname}`);
            if (pathname.startsWith('/api/')) {
                return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
            }
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Forward verified identity via headers to downstream route handlers
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', String(payload.userId ?? ''));
        requestHeaders.set('x-user-role', role);

        return NextResponse.next({ request: { headers: requestHeaders } });

    } catch (error) {
        console.warn('[SECURITY] JWT verification failed:', error);
        const { pathname } = request.nextUrl;
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }
}
