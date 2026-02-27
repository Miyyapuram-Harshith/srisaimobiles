"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
    images: string[];
    isUsed: boolean;
}

export default function ImageGallery({ images, isUsed }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fallback if no images
    const displayImages = images?.length > 0 ? images : ['/placeholder.png'];

    const nextImage = () => setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    const prevImage = () => setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image View */}
            <div className="relative w-full aspect-square bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">

                {/* Pre-Owned Badge overlay */}
                {isUsed && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-amber-500/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                        Pre-Owned
                    </div>
                )}

                {/* Carousel implementation */}
                <div className="relative w-full h-full flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentIndex}
                            src={displayImages[currentIndex]}
                            alt={`Product image ${currentIndex + 1}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                            className="object-contain w-full h-full p-4"
                        />
                    </AnimatePresence>
                </div>

                {/* Navigation Arrows for Desktop / Multiple Images */}
                {displayImages.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 text-gray-800 dark:text-gray-200 shadow-md hover:bg-white transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 text-gray-800 dark:text-gray-200 shadow-md hover:bg-white transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
            </div>

            {/* Desktop Grid / Mobile Scroll Thumbnails */}
            {displayImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
                    {displayImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${idx === currentIndex
                                    ? 'border-blue-500 shadow-md'
                                    : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                        >
                            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover bg-white" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
