import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key',
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, email, role, phone, created_at')
            .in('role', ['admin', 'super_admin'])
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Fetch team error:", error);
            return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Strictly insert into our custom users table (mocking actual auth table linking)
        const { data, error } = await supabase
            .from('users')
            .insert({
                email: body.email,
                role: 'admin',
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error("Create admin error:", error);
            return NextResponse.json({ error: 'Email directly exists or database error.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
