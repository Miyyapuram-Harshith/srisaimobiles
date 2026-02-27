import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

// Toggle out of stock status
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, is_out_of_stock } = body;

        const { data, error } = await supabase
            .from('products')
            .update({ is_out_of_stock, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select('id, name, is_out_of_stock')
            .single();

        if (error) {
            console.error("Update inventory error:", error);
            return NextResponse.json({ error: 'Failed to update stock status' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
