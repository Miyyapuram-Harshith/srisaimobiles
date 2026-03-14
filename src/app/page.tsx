import React from 'react';
import { createClient } from '@supabase/supabase-js';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { ArrowRight, Smartphone, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import HomeSlideshow from '@/components/HomeSlideshow';

export const revalidate = 60; // SSR Cache invalidation for fast data

async function getLatestProducts() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
  );

  const { data, error } = await supabase
    .from('products')
    .select('id, name, brand, price, condition, images, category')
    .order('created_at', { ascending: false })
    .limit(12);

  if (error) {
    console.error("Failed to fetch products for homepage", error);
    return [];
  }
  return data;
}

export default async function HomePage() {
  const products = await getLatestProducts();

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 pb-20">

      {/* 1. Top Navigation Bar — Logo + SRISAIMOBILES + Search */}
      <Navbar />

      {/* 2. Slideshow Banner */}
      <HomeSlideshow />

      {/* Trust Banner - Below Slideshow */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-6 md:gap-12 opacity-80">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <ShieldCheck size={18} className="text-green-500" /> Quality Verified
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Smartphone size={18} className="text-blue-500" /> Best Exchange Value
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12">

        <div className="flex items-end justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Latest Arrivals
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Fresh stock verified and ready
            </p>
          </div>
          <Link href="/products" className="hidden md:flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {/* 2-Column Mobile Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
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
          <div className="w-full py-20 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <Smartphone size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Store is Empty</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Admin needs to add products using their portal.</p>
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-8 md:hidden w-full flex justify-center">
          <Link href="/products" className="w-full py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-bold rounded-xl text-center shadow-sm">
            Browse All Devices
          </Link>
        </div>

      </main>
    </div>
  );
}
