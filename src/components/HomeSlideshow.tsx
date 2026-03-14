"use client";

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=2071&auto=format&fit=crop",
        alt: "Premium Smartphones",
        title: "Latest Premium Devices",
        subtitle: "Up to 40% Off on Top Brands"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=2000&auto=format&fit=crop",
        alt: "Mobile Accessories",
        title: "Essential Accessories",
        subtitle: "Cases, Chargers & More"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2000&auto=format&fit=crop",
        alt: "Exchange Offers",
        title: "Best Exchange Value",
        subtitle: "Upgrade Your Old Phone Today"
    }
];

export default function HomeSlideshow() {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true },
        [Autoplay({ delay: 5000, stopOnInteraction: false })]
    );
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
        emblaApi.on('select', onSelect);
        onSelect();
        return () => { emblaApi.off('select', onSelect); };
    }, [emblaApi]);

    return (
        <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-gray-900" ref={emblaRef}>
            <div className="flex touch-pan-y">
                {SLIDES.map((slide, idx) => (
                    <div
                        key={slide.id}
                        className="relative flex-[0_0_100%] min-w-0 h-[220px] sm:h-[300px] md:h-[400px] lg:h-[500px]"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={slide.image}
                            alt={slide.alt}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading={idx === 0 ? "eager" : "lazy"}
                            fetchPriority={idx === 0 ? "high" : "low"}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent flex items-center">
                            <div className="px-5 sm:px-10 md:px-16 lg:px-24">
                                <h2 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-white mb-1.5 md:mb-4 drop-shadow-md leading-tight">
                                    {slide.title}
                                </h2>
                                <p className="text-sm sm:text-lg md:text-2xl text-blue-200 font-medium drop-shadow-sm">
                                    {slide.subtitle}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Prev/Next arrows — hidden on very small screens to avoid clutter */}
            <button
                onClick={scrollPrev}
                className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-12 md:h-12 items-center justify-center bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all z-10 active:scale-90"
                aria-label="Previous slide"
            >
                <ChevronLeft size={20} />
            </button>
            <button
                onClick={scrollNext}
                className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-12 md:h-12 items-center justify-center bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all z-10 active:scale-90"
                aria-label="Next slide"
            >
                <ChevronRight size={20} />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`rounded-full transition-all duration-300 ${
                            i === selectedIndex
                                ? 'w-6 h-2 bg-white'
                                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
