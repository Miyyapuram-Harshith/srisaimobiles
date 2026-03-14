import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

function requireAdmin(request: Request): boolean {
    const role = request.headers.get('x-user-role');
    return role === 'admin' || role === 'super_admin';
}

const createProductSchema = z.object({
    title: z.string().min(1).max(200),
    price: z.number().positive().max(10_000_000),
    storage: z.string().max(100).optional().default(''),
    condition: z.string().max(50).optional().default('Used'),
    batteryHealth: z.string().max(20).optional().default(''),
    images: z.array(z.string()).max(10).optional().default([]),
    description: z.string().max(5000).optional().default(''),
    isSold: z.boolean().optional().default(false),
    timeUsed: z.string().max(100).optional(),
});

export async function GET() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
}

export async function POST(request: Request) {
    if (!requireAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const body = await request.json();
        const result = createProductSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.flatten() }, { status: 400 });
        }
        const { data, error } = await supabase.from('products').insert({
            name: result.data.title,
            brand: 'Unknown',
            category: 'Smartphone',
            condition: result.data.condition,
            price: result.data.price,
            stock_quantity: result.data.isSold ? 0 : 1,
            is_available: !result.data.isSold,
            images: result.data.images,
            description: result.data.description,
            specifications: {
                storage: result.data.storage,
                battery_health: result.data.batteryHealth,
                time_used: result.data.timeUsed,
            },
        }).select().single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
