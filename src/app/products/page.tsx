"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    condition: string;
    images: string[];
    category: string;
}

function ProductsContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState(initialQuery);
    const [activeQuery, setActiveQuery] = useState(initialQuery);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
            );
            const { data } = await supabase
                .from('products')
                .select('id, name, brand, price, condition, images, category')
                .order('created_at', { ascending: false });
            setProducts(data || []);
            setIsLoading(false);
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const q = searchParams.get('q') || '';
        setQuery(q);
        setActiveQuery(q);
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setActiveQuery(query.trim());
    };

    const filtered = activeQuery
        ? products.filter(p =>
            p.name.toLowerCase().includes(activeQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(activeQuery.toLowerCase()) ||
            p.category?.toLowerCase().includes(activeQuery.toLowerCase())
        )
        : products;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pb-4">
            <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-3 py-3">
                <div className="max-w-7xl mx-auto flex items-center gap-2">
                    <Link href="/" className="p-2 -ml-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex-shrink-0 active:scale-90">
                        <ArrowLeft size={22} />
                    </Link>
                    <form onSubmit={handleSearch} className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search mobiles, accessories..."
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-100 dark:bg-gray-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                        />
                    </form>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto px-3 pt-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        {activeQuery ? `Results for "${activeQuery}"` : 'All Devices'}
                    </h1>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                        {isLoading ? '...' : `${filtered.length} Items`}
                    </span>
                </div>
                {isLoading ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700/50 animate-pulse">
                                <div className="w-full pt-[100%] bg-gray-200 dark:bg-gray-700" />
                                <div className="p-3 space-y-2">
                                    <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {filtered.map((product) => (
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
                        <div className="text-5xl mb-4">🔍</div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">No results found</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Try a different keyword or{' '}
                            <button onClick={() => { setQuery(''); setActiveQuery(''); }} className="text-blue-600 underline">
                                clear search
                            </button>
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function AllProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
