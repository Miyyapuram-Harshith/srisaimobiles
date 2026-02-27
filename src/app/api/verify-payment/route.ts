import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase using the Service Role Key
// Webhooks are backend-to-backend communication, so we safely bypass RLS
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

export async function POST(request: Request) {
    try {
        // 1. Get the raw text payload (CRITICAL for signature verification)
        // We cannot parse it as JSON yet, because the exact string is needed for the HMAC
        const rawBody = await request.text();

        // 2. Extract Razorpay signature from headers
        const signature = request.headers.get('x-razorpay-signature');
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

        if (!signature || !webhookSecret) {
            console.error("Missing webhook signature or secret");
            return NextResponse.json({ error: 'Unauthorized' }, { status: 400 });
        }

        // 3. SECURE SIGNATURE VERIFICATION
        // Cryptographically verify that this webhook comes strictly from Razorpay
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(rawBody)
            .digest('hex');

        if (expectedSignature !== signature) {
            // Immediate rejection of spoofed/faked webhook requests
            // Strict rule: prevent any database updates on invalid signatures
            console.warn("Invalid webhook signature intercepted! Potential attack.");
            return NextResponse.json({ error: 'Invalid Signature' }, { status: 400 });
        }

        // 4. Parse the verified payload to handle the event safely
        const event = JSON.parse(rawBody);

        // 5. Handle the valid successful payment event
        if (event.event === 'payment.captured' || event.event === 'order.paid') {
            let razorpayOrderId = null;
            let paymentId = null;

            if (event.event === 'payment.captured') {
                const paymentData = event.payload.payment.entity;
                razorpayOrderId = paymentData.order_id;
                paymentId = paymentData.id;
            } else if (event.event === 'order.paid') {
                const orderData = event.payload.order.entity;
                razorpayOrderId = orderData.id;
                // order.paid might not contain the direct payment id in the same path, 
                // but 'payment.captured' is typically the reliable one for payment details.
            }

            if (razorpayOrderId) {
                // Update our database: Mark EXACTLY this order as Paid
                const { error: dbError } = await supabase
                    .from('orders')
                    .update({
                        status: 'Paid',
                        paymentId: paymentId
                    })
                    .eq('paymentId', razorpayOrderId); // Depending on your DB schema, this usually matches the razorpay order_id

                if (dbError) {
                    console.error("Database error updating order status:", dbError);
                    // Return 500 so Razorpay retries the webhook later
                    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
                }

                console.log(`Successfully verified and marked order ${razorpayOrderId} as Paid`);
            }
        }

        // 6. Return 200 OK so Razorpay knows we received it successfully and doesn't retry
        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error: any) {
        console.error("Webhook processing error:", error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}
