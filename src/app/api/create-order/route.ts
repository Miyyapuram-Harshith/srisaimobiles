import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// 1. Zod schema for input sanitization (Code & Infrastructure Security)
// Strictly validate every single piece of data before it touches the database
const orderRequestSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
});

// 2. Initialize Razorpay using Secret Server-Side Keys (Environment Variable Discipline)
const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'placeholder_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_key_secret',
});

// 3. Initialize Supabase using Service Role Key as this is a secure backend route
// Using the service role key to securely bypass RLS for server-side lookups
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

export async function POST(request: Request) {
    try {
        // 4. Parse the JSON body
        const body = await request.json();

        // 5. Input Validation (Zod)
        const result = orderRequestSchema.safeParse(body);

        // Malicious inputs or missing productId are instantly blocked
        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid input parameters or missing productId' },
                { status: 400 }
            );
        }

        const { productId } = result.data;

        // 6. Look up the true price in Supabase database (Payment Security)
        // NEVER TRUST THE FRONTEND WITH PRICING. We ignore any price sent by the client.
        const { data: product, error: dbError } = await supabase
            .from('products')
            .select('price')
            .eq('id', productId)
            .single();

        if (dbError || !product) {
            console.error("Database query failed:", dbError);
            return NextResponse.json(
                { error: 'Product not found or unavailable' },
                { status: 404 }
            );
        }

        // 7. Calculate Razorpay order amount
        // Razorpay expects the amount in the smallest currency unit (paise for INR). ₹80,000 = 8,000,000 paise.
        const amountInPaise = Math.round(product.price * 100);

        // 8. Create Secure Razorpay Order
        const orderOptions = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: `receipt_${Date.now()}_${productId.substring(0, 8)}`,
            notes: {
                productId: productId,
                // Custom notes attached to the Razorpay order for internal reference
            },
        };

        const order = await razorpay.orders.create(orderOptions);

        // 9. Send ONLY the Razorpay Order ID back to the frontend (Backend handles true pricing)
        return NextResponse.json({
            orderId: order.id,
            amount: order.amount, // Returning amount safely for UI display purposes
            currency: order.currency,
        }, { status: 200 });

    } catch (error: any) {
        console.error("Order creation error:", error);
        return NextResponse.json(
            { error: 'Failed to create order securely' },
            { status: 500 }
        );
    }
}
