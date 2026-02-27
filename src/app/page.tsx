import React from 'react';
import { createClient } from '@supabase/supabase-js';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { ArrowRight, Smartphone, ShieldCheck, Zap, User } from 'lucide-react';

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

      {/* 1. Mobile-Optimized Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-blue-600 to-blue-800 dark:from-blue-900 dark:to-gray-900 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

        {/* Login Link */}
        <div className="absolute top-4 right-4 z-20">
          <Link href="/login" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-sm font-medium transition-all text-white/90">
            <User size={16} />
            <span className="hidden sm:inline">Login</span>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10 flex flex-col items-center text-center">

          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 backdrop-blur-sm text-xs font-bold uppercase tracking-widest mb-6">
            <Zap size={14} className="text-yellow-400" />
            Sri Sai Mobiles
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
            Premium Devices.<br />
            <span className="text-blue-200">Unbeatable Prices.</span>
          </h1>

          <p className="max-w-xl text-blue-100 text-base md:text-lg mb-8 opacity-90">
            Buy, Sell, or Exchange your smartphone securely. 100% verified devices with trusted quality checks.
          </p>

          <div className="flex gap-4">
            <Link href="/products" className="bg-white text-blue-900 font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Shop Now
            </Link>
            <Link href="/contact" className="bg-blue-700/50 backdrop-blur-md border border-blue-500/50 text-white font-bold px-8 py-3.5 rounded-full hover:bg-blue-600/50 transition-all">
              Sell to Us
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Banner - Below Hero */}
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

        {/* 2. The Strict 2-Column Mobile Grid! */}
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
