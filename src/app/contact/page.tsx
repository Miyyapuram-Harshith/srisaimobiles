import React from 'react';
import Link from 'next/link';
import { Instagram, MapPin, Phone, Mail, ArrowLeft, Clock, User } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">

            {/* Simple Header */}
            <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-4">
                <div className="w-full mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors mr-2">
                            <ArrowLeft size={24} />
                        </Link>
                        <img src="/logo.png" alt="SriSaiMobiles Logo" className="h-8 sm:h-10 w-auto mix-blend-multiply dark:mix-blend-normal drop-shadow-sm" />
                        <span className="font-bold text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            Sri Sai Mobiles
                        </span>
                    </div>
                    <Link href="/login" className="p-2 -mr-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex-shrink-0">
                        <User size={24} />
                    </Link>
                </div>
            </nav>

            <main className="max-w-2xl mx-auto px-4 py-10">

                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Get in Touch</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Visit our store for the best deals, or hit us up on Instagram for quick queries!
                    </p>
                </div>

                <div className="space-y-6">

                    {/* Main Social CTA */}
                    <a
                        href="https://www.instagram.com/sri_sai_mobiles3048/?hl=en"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-6 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl shadow-md text-white hover:scale-[1.02] transition-transform"
                    >
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mr-5">
                            <Instagram size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-1">Follow us on Instagram</h2>
                            <p className="opacity-90 text-sm">@sri_sai_mobiles3048 — DM us for instant support!</p>
                        </div>
                    </a>

                    {/* Store Address Box */}
                    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                            Store Information
                        </h3>

                        <div className="space-y-5">
                            <div className="flex gap-4">
                                <div className="mt-1 text-blue-600 dark:text-blue-500">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Sri Sai Mobiles</h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        [Insert Your Physical Store Address Here]<br />
                                        [City, State, Pincode]
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="mt-1 text-blue-600 dark:text-blue-500">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Call Us</h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">+91 XXXXX XXXXX</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="mt-1 text-blue-600 dark:text-blue-500">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Store Hours</h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Mon - Sun: 10:00 AM - 9:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}
