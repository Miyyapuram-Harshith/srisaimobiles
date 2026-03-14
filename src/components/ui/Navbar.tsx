"use client";

import Link from 'next/link';
import { ShoppingBag, Search, User, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Focus input when mobile search opens
    useEffect(() => {
        if (mobileSearchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [mobileSearchOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const q = query.trim();
        if (q) {
            router.push(`/products?q=${encodeURIComponent(q)}`);
            setMobileSearchOpen(false);
            setQuery('');
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-apple-glass backdrop-blur-xl border-b border-apple-border/50 transition-colors duration-300">
            <div className="w-full px-3 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-16 text-sm font-medium text-apple-text/80">

                    {/* Logo + Brand */}
                    <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-all duration-300 group flex-shrink-0">
                        <div className="relative flex items-center justify-center p-1 rounded-xl bg-gradient-to-tr from-gray-200/50 to-transparent dark:from-gray-800/50 dark:to-transparent group-hover:shadow-md transition-all duration-300 border border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-700">
                            <img
                                src="/logo.png"
                                alt="SriSaiMobiles Logo"
                                className="h-8 sm:h-10 w-auto mix-blend-multiply dark:mix-blend-normal drop-shadow-sm"
                            />
                        </div>
                        <span className="text-base sm:text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 group-hover:from-blue-600 group-hover:to-purple-500 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 transition-all duration-300">
                            SRISAIMOBILES
                        </span>
                    </Link>

                    {/* Desktop Search Bar */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-apple-text-secondary" />
                            </div>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search mobiles, accessories..."
                                className="block w-full pl-10 pr-3 py-2 border border-apple-border rounded-full bg-apple-card/50 text-apple-text text-sm placeholder-apple-text-secondary focus:outline-none focus:ring-2 focus:ring-apple-blue/50 focus:border-apple-blue transition-all duration-300"
                            />
                        </div>
                    </form>

                    {/* Right Icons */}
                    <div className="flex items-center gap-1 sm:gap-3">
                        {/* Mobile search toggle */}
                        <button
                            aria-label="Search"
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:scale-90"
                        >
                            {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                        </button>
                        <div className="hover:scale-110 active:scale-90 transition-transform hidden sm:block">
                            <ThemeToggle />
                        </div>
                        <Link href="/login" aria-label="Account" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hover:text-apple-blue active:scale-90">
                            <User className="w-5 h-5" />
                        </Link>
                        <Link href="/cart" aria-label="Cart" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hover:text-apple-blue active:scale-90 hidden md:flex">
                            <ShoppingBag className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile search expansion */}
            {mobileSearchOpen && (
                <div className="md:hidden px-3 pb-3 border-t border-apple-border/30">
                    <form onSubmit={handleSearch} className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search mobiles, accessories..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
                        />
                    </form>
                </div>
            )}
        </nav>
    );
}
