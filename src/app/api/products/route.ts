import { NextResponse } from 'next/server';
import { getDb, saveDb, Product } from '@/lib/db';

export async function GET() {
    const db = await getDb();
    return NextResponse.json(db.products);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const db = await getDb();

        // Create new product
        const newProduct: Product = {
            ...body,
            id: `prod_${Date.now()}`,
            createdAt: new Date().toISOString(),
            isSold: false
        };

        db.products.push(newProduct);
        await saveDb(db);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
