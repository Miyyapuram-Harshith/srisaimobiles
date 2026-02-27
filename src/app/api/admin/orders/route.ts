import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                id, 
                amount, 
                status, 
                tracking_id, 
                created_at, 
                shipping_address, 
                user_id,
                users ( phone, email )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Fetch orders error:", error);
            return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, tracking_id, status } = body;

        const { data, error } = await supabase
            .from('orders')
            .update({
                tracking_id,
                status: status || 'Dispatched',
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Update order error:", error);
            return NextResponse.json({ error: 'Failed to update order tracking' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
