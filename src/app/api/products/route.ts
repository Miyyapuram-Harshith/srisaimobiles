import { NextResponse } from 'next/server';
import { getDb, saveDb, Product } from '@/lib/db';
import { z } from 'zod';

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

// ── GET — public ─────────────────────────────────────────────────────────────
export async function GET() {
    const db = await getDb();
    return NextResponse.json(db.products);
}

// ── POST — admin only ─────────────────────────────────────────────────────────
export async function POST(request: Request) {
    if (!requireAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }
    try {
        const body = await request.json();
        const result = createProductSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.flatten() }, { status: 400 });
        }
        const db = await getDb();
        const newProduct: Product = {
            id: `prod_${Date.now()}`,
            createdAt: new Date().toISOString(),
            title: result.data.title,
            price: result.data.price,
            storage: result.data.storage ?? '',
            condition: result.data.condition ?? 'Used',
            batteryHealth: result.data.batteryHealth ?? '',
            images: result.data.images ?? [],
            description: result.data.description ?? '',
            isSold: result.data.isSold ?? false,
            timeUsed: result.data.timeUsed,
        };
        db.products.push(newProduct);
        await saveDb(db);
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('[ERROR] Create product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
