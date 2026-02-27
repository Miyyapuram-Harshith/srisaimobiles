"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
    id: string;
    name: string;
    brand: string;
    price: number;
    condition: string;
    images: string[];
}

export default function ProductCard({ id, name, brand, price, condition, images }: ProductCardProps) {
    const isUsed = condition === 'Used';
    const mainImage = images && images.length > 0 ? images[0] : '/placeholder.png'; // Make sure to have a placeholder in public/

    return (
        <Link href={`/products/${id}`} className="group block">
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col">

                {/* Top Image Section (Critical Next.js Image Optimization) */}
                <div className="relative w-full pt-[100%] bg-gray-50 dark:bg-gray-900 overflow-hidden">

                    {/* Elegant Pre-Owned Badge */}
                    {isUsed && (
                        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
                            Pre-Owned
                        </div>
                    )}

                    <Image
                        src={mainImage}
                        alt={`Image of ${name}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-contain p-2 md:p-4 group-hover:scale-105 transition-transform duration-300"
                    // priority={false} // Only set to true for LCP images on the homepage (handled by parent typically)
                    />
                </div>

                {/* Bottom Data Section - Highly compact but readable */}
                <div className="p-3 md:p-4 flex flex-col flex-grow justify-between">
                    <div>
                        <span className="text-[10px] md:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">
                            {brand}
                        </span>
                        <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                            {name}
                        </h3>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50 dark:border-gray-700/30">
                        <span className="text-sm md:text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">
                            ₹{price.toLocaleString('en-IN')}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>

            </div>
        </Link>
    );
}
