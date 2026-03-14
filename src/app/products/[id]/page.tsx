import React from 'react';
import { createClient } from '@supabase/supabase-js';
import ImageGallery from '@/components/product/ImageGallery';
import TrustBadges from '@/components/product/TrustBadges';
import PincodeChecker from '@/components/product/PincodeChecker';
import StickyBuyBar from '@/components/product/StickyBuyBar';
import WhatsAppShare from '@/components/product/WhatsAppShare';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Keep this page fast & SEO friendly by rendering on the Server
export const revalidate = 60; // Revalidate every 60 seconds

async function getProduct(id: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co',
        process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
    );

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return null;
    return data;
}

export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await getProduct(params.id);

    if (!product) {
        notFound(); // Triggers Next.js 404 page automatically
    }

    const isOutOfStock = product.stock_quantity <= 0;
    const isUsed = product.condition === 'Used';

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pb-32 md:pb-12 text-sm text-gray-500">
            {/* Top Navigation */}
            <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px] md:max-w-md">
                        {product.name}
                    </span>
                    <div className="w-10"></div> {/* Spacer for centering */}
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-3 md:py-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 relative">

                {/* Left Column: Image Gallery (Client Component) */}
                <div className="w-full">
                    <div className="sticky top-24">
                        <ImageGallery images={product.images} isUsed={isUsed} />
                    </div>
                </div>

                {/* Right Column: High-Converting Sales Copy & Badges */}
                <div className="flex flex-col">

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-wider rounded-md">
                                {product.brand}
                            </span>
                            <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-md">
                                {product.category}
                            </span>
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                            {product.name}
                        </h1>

                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                                ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                (Incl. of all taxes)
                            </span>
                        </div>

                        {/* In Stock / Out of Stock Indicator */}
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold mb-6 ${isOutOfStock
                                ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                            }`}>
                            <div className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
                            {isOutOfStock ? 'Out of Stock' : 'In Stock & Ready to Ship'}
                        </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                        {product.description}
                    </p>

                    <hr className="border-gray-100 dark:border-gray-800 mb-8" />

                    {/* Dynamic Specs & Trust Badges (Client Component to handle JSONB safely) */}
                    <TrustBadges
                        category={product.category}
                        brand={product.brand}
                        condition={product.condition}
                        specifications={product.specifications}
                        trustGrade={product.trust_grade}
                        hasOriginalBox={product.has_original_box}
                        hasOriginalBill={product.has_original_bill}
                        adminRemarks={product.admin_remarks}
                    />

                    <hr className="border-gray-100 dark:border-gray-800 my-8" />

                    {/* Conversion Drivers */}
                    <div className="flex flex-col gap-4">

                        {/* Desktop Add to Cart Button (Hidden on strict mobile to favor Sticky Bar) */}
                        <div className="hidden md:block">
                            <button
                                disabled={isOutOfStock}
                                className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all
                  ${isOutOfStock
                                        ? 'bg-gray-400 cursor-not-allowed dark:bg-gray-700'
                                        : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
                                    }`}
                            >
                                {isOutOfStock ? 'Currently Unavailable' : 'Add to Cart — Buy Now'}
                            </button>
                        </div>

                        <WhatsAppShare productName={product.name} price={product.price} />
                        <PincodeChecker />

                        <div className="flex items-center justify-center gap-2 mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                            <ShieldCheck size={18} className="text-green-500" />
                            100% Secure Payment via Razorpay
                        </div>
                    </div>

                </div>
            </main>

            {/* Sticky Bottom Bar for Mobile Only Conversions */}
            <StickyBuyBar
                price={product.price}
                isOutOfStock={isOutOfStock}
                onAddToCart={() => console.log('Added to cart via sticky bar')}
            />

        </div>
    );
}
