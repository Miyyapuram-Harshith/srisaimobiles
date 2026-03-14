import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';


// ── Supabase client for Supabase-backed data ─────────────────────────────────
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

// ── Types supported ───────────────────────────────────────────────────────────
const ALLOWED_TYPES = ['products', 'orders', 'inventory'] as const;
type ExportType = (typeof ALLOWED_TYPES)[number];

// ── Route: GET /api/admin/export?type=products|orders|inventory ──────────────
// Protected by middleware — only admins reach this handler
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
            // Try Supabase first, fall back to local db.json
            const { data, error } = await supabase
                .from('products')
                .select('id, name, brand, price, condition, category, stock_quantity, is_out_of_stock, created_at')
                .order('created_at', { ascending: false });

            if (!error && data && data.length > 0) {
                rows = data.map((p) => ({
                    'Product ID': p.id,
                    'Name': p.name,
                    'Brand': p.brand,
                    'Price (₹)': p.price,
                    'Condition': p.condition,
                    'Category': p.category || '—',
                    'Stock Qty': p.stock_quantity ?? 0,
                    'Out of Stock': p.is_out_of_stock ? 'Yes' : 'No',
                    'Created At': new Date(p.created_at).toLocaleString('en-IN'),
                }));
            } else {
                // Fall back to local db.json
                const db = await getDb();
                rows = db.products.map((p) => ({
                    'Product ID': p.id,
                    'Title': p.title,
                    'Price (₹)': p.price,
                    'Condition': p.condition,
                    'Storage': p.storage,
                    'Battery Health': p.batteryHealth,
                    'Is Sold': p.isSold ? 'Yes' : 'No',
                    'Created At': new Date(p.createdAt).toLocaleString('en-IN'),
                }));
            }

            sheetName = 'Products';
            filename = `products_${formatDate()}.xlsx`;

        } else if (type === 'orders') {
            const { data, error } = await supabase
                .from('orders')
                .select('id, amount, status, tracking_id, created_at, shipping_address, user_id')
                .order('created_at', { ascending: false });

            if (!error && data) {
                rows = data.map((o) => ({
                    'Order ID': o.id,
                    'User ID': o.user_id,
                    'Amount (₹)': o.amount,
                    'Status': o.status,
                    'Tracking ID': o.tracking_id || '—',
                    'Address': typeof o.shipping_address === 'object'
                        ? JSON.stringify(o.shipping_address)
                        : (o.shipping_address || '—'),
                    'Placed At': new Date(o.created_at).toLocaleString('en-IN'),
                }));
            }

            sheetName = 'Orders';
            filename = `orders_${formatDate()}.xlsx`;

        } else if (type === 'inventory') {
            const { data, error } = await supabase
                .from('products')
                .select('id, name, brand, stock_quantity, is_out_of_stock, condition')
                .order('name', { ascending: true });

            if (!error && data) {
                rows = data.map((p) => ({
                    'Product ID': p.id,
                    'Name': p.name,
                    'Brand': p.brand,
                    'Condition': p.condition,
                    'Stock Qty': p.stock_quantity ?? 0,
                    'Status': p.is_out_of_stock ? 'Out of Stock' : 'In Stock',
                }));
            }

            sheetName = 'Inventory';
            filename = `inventory_${formatDate()}.xlsx`;
        }

        if (rows.length === 0) {
            rows = [{ 'Note': 'No data found' }];
        }

        // Build xlsx workbook
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        // Auto-fit column widths
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
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}
