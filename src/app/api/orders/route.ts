import { NextResponse } from 'next/server';
import { getDb, saveDb, Order } from '@/lib/db';

export async function GET() {
    const db = await getDb();
    return NextResponse.json(db.orders);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const db = await getDb();

        // Process order
        const newOrder: Order = {
            ...body,
            id: `ord_${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'Completed'
        };

        // Mark product as sold
        const productIndex = db.products.findIndex(p => p.id === newOrder.productId);
        if (productIndex !== -1) {
            db.products[productIndex].isSold = true;
        }

        db.orders.push(newOrder);
        await saveDb(db);

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
