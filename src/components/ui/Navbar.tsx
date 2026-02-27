import Link from 'next/link';
import { ShoppingBag, Search, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-apple-glass backdrop-blur-xl border-b border-apple-border/50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-12 text-sm font-medium text-apple-text/80">

                    {/* Logo */}
                    <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                        <img src="/logo.png" alt="SriSaiMobiles Logo" className="h-8 w-auto mix-blend-multiply mr-2" />
                        <span className="text-lg font-semibold tracking-tight text-apple-black hidden sm:inline-block">SriSaiMobiles</span>
                    </Link>

                    {/* Search Bar - Middle */}
                    <div className="hidden md:flex flex-1 max-w-md mx-6">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-apple-text-secondary" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="block w-full pl-10 pr-3 py-1.5 border border-apple-border rounded-full bg-apple-card/50 text-apple-text text-sm placeholder-apple-text-secondary focus:outline-none focus:ring-2 focus:ring-apple-blue/50 focus:border-apple-blue transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-6">
                        <div className="hover:scale-110 active:scale-95 transition-transform">
                            <ThemeToggle />
                        </div>
                        <button aria-label="Search" className="md:hidden hover:text-apple-blue transition-colors hover:scale-110 active:scale-95">
                            <Search className="w-5 h-5" />
                        </button>
                        <Link href="/login" aria-label="Account" className="hover:text-apple-blue transition-colors hover:scale-110 active:scale-95">
                            <User className="w-5 h-5" />
                        </Link>
                        <Link href="/cart" aria-label="Cart" className="hover:text-apple-blue transition-colors hover:scale-110 active:scale-95">
                            <ShoppingBag className="w-5 h-5" />
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    );
}
