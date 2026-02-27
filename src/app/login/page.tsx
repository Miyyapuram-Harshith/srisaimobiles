"use client";

import React, { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { Loader2, ArrowRight, ShieldCheck, Smartphone } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();

    // Step 1: Identifier
    const [identifier, setIdentifier] = useState("");
    const [step, setStep] = useState<1 | 2>(1);
    const [authType, setAuthType] = useState<"phone" | "email" | null>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Step 2: Verification
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");

    const handleContinue = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const cleanIdentifier = identifier.trim();

        // Zod-like regex validation
        const isPhone = /^\d{10}$/.test(cleanIdentifier);
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanIdentifier);

        if (!isPhone && !isEmail) {
            setError("Please enter a valid 10-digit mobile number or email address.");
            return;
        }

        setIsLoading(true);

        if (isPhone) {
            try {
                // Send OTP
                const res = await fetch('/api/auth/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: '+91' + cleanIdentifier }),
                });

                if (res.ok) {
                    setAuthType("phone");
                    setStep(2);
                } else {
                    const data = await res.json();
                    setError(data.error || "Failed to send OTP.");
                }
            } catch (err) {
                setError("Network error. Please try again.");
            }
        } else if (isEmail) {
            // Email/Password flow - just transition to step 2 directly to hide admin existence
            setAuthType("email");
            setStep(2);
        }

        setIsLoading(false);
    };

    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const cleanIdentifier = identifier.trim();

        try {
            if (authType === "phone") {
                const res = await fetch('/api/auth/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: '+91' + cleanIdentifier, otp }),
                });

                if (res.ok) {
                    const data = await res.json();
                    trafficCopRedirect(data.role);
                } else {
                    setError("Invalid login details.");
                }
            } else if (authType === "email") {
                // To keep the backend secure with Edge Middleware, we pass the email/password to our custom login route
                // which integrates with Supabase under the hood or verifies securely.
                const res = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: cleanIdentifier, password }),
                });

                if (res.ok) {
                    const data = await res.json();
                    trafficCopRedirect(data.role);
                } else {
                    // Generic error to prevent email enumeration
                    setError("Invalid login details.");
                }
            }
        } catch (err) {
            setError("Network error. Please try again.");
        }

        setIsLoading(false);
    };

    const trafficCopRedirect = (role?: string) => {
        router.refresh(); // Crucial to update the server middleware state
        if (role === 'super_admin' || role === 'admin') {
            router.push('/admin');
        } else {
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden relative">

                    {/* Top Progress / Back indicator */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 dark:bg-gray-800">
                        <motion.div
                            className="h-full bg-blue-500"
                            initial={{ width: "50%" }}
                            animate={{ width: step === 1 ? "50%" : "100%" }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    <div className="p-8 sm:p-10 pt-12">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
                                Welcome
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Sign in or create an account to continue.
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl text-center font-medium border border-red-100 dark:border-red-900/50"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="relative min-h-[200px]">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.form
                                        key="step1"
                                        onSubmit={handleContinue}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Mobile Number or Email
                                            </label>
                                            <input
                                                type="text"
                                                value={identifier}
                                                onChange={(e) => setIdentifier(e.target.value)}
                                                placeholder="e.g. 9876543210 or user@email.com"
                                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white font-medium"
                                                required
                                                autoFocus
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition duration-300 shadow-md disabled:opacity-70"
                                        >
                                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Continue"}
                                            {!isLoading && <ArrowRight size={18} />}
                                        </button>
                                    </motion.form>
                                )}

                                {step === 2 && (
                                    <motion.form
                                        key="step2"
                                        onSubmit={handleVerification}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    {authType === 'phone' ? 'Enter OTP' : 'Enter Password'}
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(1)}
                                                    className="text-xs text-blue-600 font-bold hover:underline"
                                                >
                                                    Change
                                                </button>
                                            </div>

                                            {authType === 'phone' && (
                                                <div className="space-y-2">
                                                    <p className="text-xs text-gray-500">Sent to +91 {identifier}</p>
                                                    <input
                                                        type="text"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        placeholder="6-digit code"
                                                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white tracking-widest text-center text-xl font-bold"
                                                        maxLength={6}
                                                        required
                                                        autoFocus
                                                    />
                                                </div>
                                            )}

                                            {authType === 'email' && (
                                                <div className="space-y-2">
                                                    <p className="text-xs text-gray-500">{identifier}</p>
                                                    <input
                                                        type="password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        placeholder="••••••••••"
                                                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white font-medium"
                                                        required
                                                        autoFocus
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full flex items-center justify-center py-3.5 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300 shadow-md disabled:opacity-70"
                                        >
                                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Login"}
                                        </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Security Badges */}
                <div className="absolute bottom-8 left-0 w-full flex justify-center gap-6 opacity-60">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400">
                        <ShieldCheck size={16} className="text-green-500" /> Secure Login
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400">
                        <Smartphone size={16} className="text-blue-500" /> OTP Verified
                    </div>
                </div>
            </div>
        </div>
    );
}
