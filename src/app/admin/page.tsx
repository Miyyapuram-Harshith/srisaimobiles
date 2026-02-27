"use client";

import React, { useState, useEffect } from "react";
import { Loader2, IndianRupee, ShoppingBag, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface DashboardMetrics {
    totalRevenue: number;
    todaysRevenue: number;
    pendingOrders: number;
    lowStockCount: number;
    totalOrders: number;
}

export default function AdminDashboardPage() {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await fetch('/api/admin/dashboard');
                if (res.ok) {
                    const { data } = await res.json();
                    setMetrics(data);
                } else {
                    toast.error("Failed to load dashboard metrics.");
                }
            } catch (err) {
                toast.error("Network error.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-sm font-medium text-zinc-500">Compiling your KPIs...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Admin Overview</h1>
                <p className="text-sm text-zinc-500 mt-1">Check your daily operations and recent metrics seamlessly.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

                {/* Revenue Today */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <IndianRupee className="w-16 h-16 text-emerald-500" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            Today's Revenue
                        </h3>
                        <p className="text-3xl font-black text-zinc-900 dark:text-white">
                            ₹{metrics?.todaysRevenue.toLocaleString('en-IN') || 0}
                        </p>
                    </div>
                </div>

                {/* Pending Orders */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingBag className="w-16 h-16 text-blue-500" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            Pending Orders
                        </h3>
                        <p className="text-3xl font-black text-zinc-900 dark:text-white">
                            {metrics?.pendingOrders || 0}
                        </p>
                        {metrics && metrics.pendingOrders > 0 && (
                            <Link href="/admin/orders" className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-3 inline-flex items-center hover:underline">
                                Action Required <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertTriangle className="w-16 h-16 text-red-500" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            Low Stock
                        </h3>
                        <p className={`text-3xl font-black ${metrics && metrics.lowStockCount > 0 ? "text-red-500" : "text-zinc-900 dark:text-white"}`}>
                            {metrics?.lowStockCount || 0}
                        </p>
                        {metrics && metrics.lowStockCount > 0 && (
                            <Link href="/admin/inventory" className="text-xs font-bold text-red-600 dark:text-red-400 mt-3 inline-flex items-center hover:underline">
                                Refill Inventory <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Total Lifetime Value */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="w-16 h-16 text-purple-500" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            Overall Volume
                        </h3>
                        <p className="text-3xl font-black text-zinc-900 dark:text-white">
                            ₹{metrics?.totalRevenue.toLocaleString('en-IN') || 0}
                        </p>
                        <p className="text-xs font-medium text-zinc-400 mt-3">
                            From {metrics?.totalOrders || 0} total orders
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="pt-4">
                <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white mb-4">Quick Shortcuts</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Link href="/admin/add-product" className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-black dark:hover:border-white transition-colors flex flex-col items-center justify-center text-center gap-2 group">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold">Add Device</span>
                    </Link>

                    <Link href="/admin/storefront" className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-black dark:hover:border-white transition-colors flex flex-col items-center justify-center text-center gap-2 group">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold">Update Banner</span>
                    </Link>

                    <Link href="/admin/orders" className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-black dark:hover:border-white transition-colors flex flex-col items-center justify-center text-center gap-2 group">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold">Dispatch Orders</span>
                    </Link>

                    <Link href="/admin/team" className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-black dark:hover:border-white transition-colors flex flex-col items-center justify-center text-center gap-2 group">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                            <IndianRupee className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold">Manage Staff</span>
                    </Link>
                </div>
            </div>

        </div>
    );
}
