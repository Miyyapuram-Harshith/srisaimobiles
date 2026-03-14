import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

export async function GET() {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { data: product } = await supabase
            .from('products').select('id').eq('id', body.productId).single();
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

        const { data: order, error } = await supabase.from('orders').insert({
            user_id: body.userId,
            total_amount: body.amount,
            status: 'confirmed',
            delivery_address: body.address,
            razorpay_payment_id: body.paymentId,
        }).select().single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        await supabase.from('products').update({ is_available: false, stock_quantity: 0 }).eq('id', body.productId);

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
