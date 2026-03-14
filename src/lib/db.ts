// db.ts — Supabase only, no local file system
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Product {
    id: string;
    title: string;
    price: number;
    storage: string;
    condition: string;
    batteryHealth: string;
    images: string[];
    description: string;
    isSold: boolean;
    createdAt: string;
    timeUsed?: string;
}

export interface Order {
    id: string;
    userId: string;
    productId: string;
    paymentId: string;
    amount: number;
    status: string;
    createdAt: string;
}

export async function getDb() {
    const [{ data: products }, { data: orders }] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('orders').select('*'),
    ]);
    return {
        products: products || [],
        orders: orders || [],
    };
}

export async function saveDb() {
    // No-op: all saves go directly via supabase client
    console.warn('saveDb() is deprecated. Use supabase directly.');
}
