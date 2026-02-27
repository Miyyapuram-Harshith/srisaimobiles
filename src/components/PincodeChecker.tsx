"use client";

import { useState } from "react";
import { Search, CheckCircle2, XCircle, MapPinIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PincodeChecker() {
    const [pincode, setPincode] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleCheck = (e: React.FormEvent) => {
        e.preventDefault();
        if (pincode.length !== 6) return;

        setStatus("loading");

        // Simulate API call to check serviceability
        setTimeout(() => {
            // Mock validation: e.g., 50xxxx is valid, others invalid
            if (pincode.startsWith("50")) {
                setStatus("success");
                setMessage(`Delivery available to ${pincode} via DTDC. ETA: 2-3 Days.`);
            } else {
                setStatus("error");
                setMessage(`Sorry, we do not deliver to ${pincode} currently.`);
            }
        }, 800);
    };

    return (
        <div className="w-full max-w-sm rounded-2xl bg-white/50 dark:bg-zinc-900/50 p-4 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-2 mb-3">
                <MapPinIcon className="w-4 h-4 text-zinc-500" />
                <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Check Delivery Option
                </h3>
            </div>

            <form onSubmit={handleCheck} className="relative flex items-center">
                <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                />
                <button
                    type="submit"
                    disabled={pincode.length !== 6 || status === "loading"}
                    className="absolute right-2 p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50 text-zinc-800 dark:text-zinc-200"
                >
                    {status === "loading" ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-800 dark:border-zinc-500 dark:border-t-zinc-200 rounded-full"
                        />
                    ) : (
                        <Search className="w-4 h-4" />
                    )}
                </button>
            </form>

            <AnimatePresence>
                {status !== "idle" && status !== "loading" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className={`flex items-start gap-2 text-xs p-3 rounded-xl ${status === "success"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50"
                                : "bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50"
                            }`}
                    >
                        {status === "success" ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                        ) : (
                            <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        )}
                        <p className="leading-relaxed">{message}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
