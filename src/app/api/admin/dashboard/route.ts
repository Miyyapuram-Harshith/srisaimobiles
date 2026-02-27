import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

export async function GET() {
    try {
        // 1. Get all orders to calculate revenue and pending fulfillments
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('amount, status, tracking_id, created_at');

        // 2. Get count of products out of stock
        const { count: lowStockCount, error: stockError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('is_out_of_stock', true);

        if (ordersError || stockError) {
            console.error("Dashboard KPI fetch error", { ordersError, stockError });
            return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
        }

        let totalRevenue = 0;
        let todaysRevenue = 0;
        let pendingOrders = 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        orders?.forEach(o => {
            // Amount is stored in paise (Razorpay standard)
            const orderValue = (o.amount || 0) / 100;
            totalRevenue += orderValue;

            const orderDate = new Date(o.created_at);
            if (orderDate >= today) {
                todaysRevenue += orderValue;
            }

            if (o.status !== 'Dispatched' && !o.tracking_id) {
                pendingOrders++;
            }
        });

        return NextResponse.json({
            data: {
                totalRevenue,
                todaysRevenue,
                pendingOrders,
                lowStockCount: lowStockCount || 0,
                totalOrders: orders?.length || 0
            }
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
