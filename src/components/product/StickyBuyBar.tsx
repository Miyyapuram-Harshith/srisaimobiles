"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StickyBuyBarProps {
    price: number;
    onAddToCart: () => void;
    isOutOfStock: boolean;
}

export default function StickyBuyBar({ price, onAddToCart, isOutOfStock }: StickyBuyBarProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show sticky bar after scrolling past the main hero intro
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-16 left-0 right-0 z-[55] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 shadow-2xl md:hidden"
                >
                    <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Total Price</span>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                ₹{price.toLocaleString('en-IN')}
                            </span>
                        </div>

                        <button
                            onClick={onAddToCart}
                            disabled={isOutOfStock}
                            className={`flex-1 max-w-[200px] flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white transition-colors shadow-sm
                ${isOutOfStock
                                    ? 'bg-gray-400 cursor-not-allowed dark:bg-gray-700'
                                    : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                                }`}
                        >
                            {isOutOfStock ? (
                                'Out of Stock'
                            ) : (
                                <>
                                    <ShoppingCart size={18} />
                                    Buy Now
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
