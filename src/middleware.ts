import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// 1. Edge Compatibility: Standard 'jsonwebtoken' doesn't work in Edge Runtime
// We use 'jose' which is designed specifically for standard Web Crypto APIs

// 2. Define the exact routes this middleware strictly enforces RBAC on
export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};

export async function middleware(request: NextRequest) {
    try {
        const { pathname } = request.nextUrl;

        // Bypass token check for the login route itself
        if (pathname === '/api/admin/login') {
            return NextResponse.next();
        }

        // 3. Extract the secure HttpOnly cookie
        const tokenCookie = request.cookies.get('auth_session');

        // 4. Missing Token -> Immediate Redirect/Rejection
        if (!tokenCookie || !tokenCookie.value) {
            if (pathname.startsWith('/api/')) {
                return NextResponse.json({ error: 'Unauthorized: Complete login first' }, { status: 401 });
            }
            // Redirect UI access attempts back to the login page
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const secret = process.env.JWT_SECRET || 'fallback_development_secret_key_123!';

        // 5. Verify the Token Cryptographically at the Edge
        const encodedSecret = new TextEncoder().encode(secret);

        const { payload } = await jwtVerify(tokenCookie.value, encodedSecret);
        const role = payload.role as string;

        // 6. Strict RBAC Logic: True Backend Verification
        // A hacker cannot bypass this even if they manually type "/admin" in the URL
        if (role !== 'admin' && role !== 'super_admin') {
            console.warn(`Unauthorized access attempt by role '${role}' to ${pathname}`);

            if (pathname.startsWith('/api/')) {
                // Return 403 Forbidden for API routes (they technically authenticated, but lack authorization)
                return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
            }

            // Redirect customers trying to access the admin UI back to the homepage
            return NextResponse.redirect(new URL('/', request.url));
        }

        // 7. Allow the request to proceed if verified and authorized
        // (Optional: Pass user info to the downstream API routes securely via headers)
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', payload.userId as string);
        requestHeaders.set('x-user-role', role);

        const response = NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

        return response;

    } catch (error) {
        // If the token is expired or malformed, 'jwtVerify' naturally throws an error
        console.warn("JWT verification failed in middleware:", error);

        const { pathname } = request.nextUrl;
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'Unauthorized: Invalid or Expired Token' }, { status: 401 });
        }

        // Force them back to the login page to re-authenticate
        return NextResponse.redirect(new URL('/login', request.url));
    }
}
