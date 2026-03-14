import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

const ALLOWED_TYPES = ['products', 'orders', 'inventory'] as const;
type ExportType = (typeof ALLOWED_TYPES)[number];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as ExportType | null;

    if (!type || !ALLOWED_TYPES.includes(type)) {
        return NextResponse.json(
            { error: `Invalid export type. Use one of: ${ALLOWED_TYPES.join(', ')}` },
            { status: 400 }
        );
    }

    try {
        let rows: Record<string, unknown>[] = [];
        let sheetName = 'Data';
        let filename = 'export.xlsx';

        if (type === 'products') {
            const { data } = await supabase
                .from('products')
                .select('id, name, brand, price, condition, category, stock_quantity, is_available, created_at')
                .order('created_at', { ascending: false });

            rows = (data || []).map((p) => ({
                'Product ID': p.id,
                'Name': p.name,
                'Brand': p.brand,
                'Price (₹)': p.price,
                'Condition': p.condition,
                'Category': p.category || '—',
                'Stock Qty': p.stock_quantity ?? 0,
                'Available': p.is_available ? 'Yes' : 'No',
                'Created At': new Date(p.created_at).toLocaleString('en-IN'),
            }));

            sheetName = 'Products';
            filename = `products_${formatDate()}.xlsx`;

        } else if (type === 'orders') {
            const { data } = await supabase
                .from('orders')
                .select('id, total_amount, status, created_at, delivery_address, user_id')
                .order('created_at', { ascending: false });

            rows = (data || []).map((o) => ({
                'Order ID': o.id,
                'User ID': o.user_id,
                'Amount (₹)': o.total_amount,
                'Status': o.status,
                'Address': o.delivery_address || '—',
                'Placed At': new Date(o.created_at).toLocaleString('en-IN'),
            }));

            sheetName = 'Orders';
            filename = `orders_${formatDate()}.xlsx`;

        } else if (type === 'inventory') {
            const { data } = await supabase
                .from('products')
                .select('id, name, brand, stock_quantity, is_available, condition')
                .order('name', { ascending: true });

            rows = (data || []).map((p) => ({
                'Product ID': p.id,
                'Name': p.name,
                'Brand': p.brand,
                'Condition': p.condition,
                'Stock Qty': p.stock_quantity ?? 0,
                'Status': p.is_available ? 'In Stock' : 'Out of Stock',
            }));

            sheetName = 'Inventory';
            filename = `inventory_${formatDate()}.xlsx`;
        }

        if (rows.length === 0) {
            rows = [{ 'Note': 'No data found' }];
        }

        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        const colWidths = Object.keys(rows[0] || {}).map((key) => ({
            wch: Math.max(key.length + 2, 15),
        }));
        ws['!cols'] = colWidths;

        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': String(buffer.length),
                'Cache-Control': 'no-store',
            },
        });

    } catch (error) {
        console.error('[ERROR] Export failed:', error);
        return NextResponse.json({ error: 'Export failed' }, { status: 500 });
    }
}

function formatDate(): string {
    return new Date().toISOString().slice(0, 10);
}
