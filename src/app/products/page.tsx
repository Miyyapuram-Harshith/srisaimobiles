import React from 'react';
import { createClient } from '@supabase/supabase-js';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { ArrowLeft, Search, User } from 'lucide-react';

export const revalidate = 60; // 1-minute cache

async function getAllProducts() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
    );

    const { data, error } = await supabase
        .from('products')
        .select('id, name, brand, price, condition, images, category')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Failed to fetch products", error);
        return [];
    }
    return data;
}

export default async function AllProductsPage() {
    const products = await getAllProducts();

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pb-20">

            {/* Header */}
            <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-4 mb-6">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <Link href="/" className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex-shrink-0">
                        <ArrowLeft size={24} />
                    </Link>
                    <div className="relative flex-1 max-w-md mx-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search mobiles, accessories..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                        />
                    </div>
                    <Link href="/login" className="p-2 -mr-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex-shrink-0">
                        <User size={24} />
                    </Link>
                </div>
            </nav>

            {/* Main Grid */}
            <main className="max-w-7xl mx-auto px-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Devices</h1>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                        {products.length} Items
                    </span>
                </div>

                {/* 2-Column Mobile Grid strictly maintained */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                brand={product.brand}
                                price={product.price}
                                condition={product.condition}
                                images={product.images}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No products available at the moment.</p>
                    </div>
                )}
            </main>

        </div>
    );
}
