"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Truck, CheckCircle2, ChevronRight, Clock, MapPin } from "lucide-react";

type OrderStatus = 'confirmed' | 'packed' | 'shipped' | 'delivered';

interface TimelineItemProps {
    status: OrderStatus;
    currentStatus: OrderStatus;
    title: string;
    description: string;
    date?: string;
    icon: any;
    isLast?: boolean;
    trackingInfo?: {
        courier: string;
        awb: string;
    };
}

const statusOrder = ['confirmed', 'packed', 'shipped', 'delivered'];

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");
    const [isTracking, setIsTracking] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId) return;

        setIsTracking(true);
        setHasSearched(false);

        // Simulate API call
        setTimeout(() => {
            setIsTracking(false);
            setHasSearched(true);
        }, 1200);
    };

    const currentStatus: OrderStatus = 'shipped'; // Mocked status

    const TimelineItem = ({
        status, currentStatus, title, description, date, icon: Icon, isLast, trackingInfo
    }: TimelineItemProps) => {
        const statusIndex = statusOrder.indexOf(status);
        const currentIndex = statusOrder.indexOf(currentStatus);
        const isCompleted = statusIndex <= currentIndex;
        const isActive = statusIndex === currentIndex;

        return (
            <div className="relative flex gap-6">
                {/* Timeline Line */}
                {!isLast && (
                    <div className={`absolute top-10 left-6 bottom-[-24px] w-0.5 ${isCompleted && !isActive ? "bg-black dark:bg-zinc-100" : "bg-zinc-200 dark:bg-zinc-800 border-dashed border-l-2"
                        }`} />
                )}

                {/* Icon Circle */}
                <div className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-2xl shrink-0 transition-colors ${isCompleted
                        ? "bg-black text-white dark:bg-zinc-100 dark:text-black shadow-lg shadow-black/10 dark:shadow-white/10"
                        : "bg-white text-zinc-400 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800"
                    }`}>
                    <Icon className="w-5 h-5" />

                    {/* Active Ping Animation */}
                    {isActive && (
                        <span className="absolute w-full h-full rounded-2xl bg-black dark:bg-white inset-0 -z-10 animate-ping opacity-20" />
                    )}
                </div>

                {/* Content */}
                <div className={`flex-1 pb-10 ${!isCompleted && "opacity-50"}`}>
                    <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-2 gap-4">
                            <h3 className={`font-semibold text-lg tracking-tight ${isCompleted ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500"
                                }`}>
                                {title}
                            </h3>
                            {date && (
                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 shrink-0">
                                    {date}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            {description}
                        </p>

                        {trackingInfo && isCompleted && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 flex flex-col sm:flex-row gap-3"
                            >
                                <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60">
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wider font-semibold">Courier Partner</p>
                                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-emerald-600" />
                                        {trackingInfo.courier}
                                    </p>
                                </div>
                                <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60">
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wider font-semibold">Tracking AWB ID</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold tracking-wider text-black dark:text-white">
                                            {trackingInfo.awb}
                                        </p>
                                        <button className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto flex flex-col items-center">

                <div className="text-center mb-10 w-full max-w-xl">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
                        Track Your Order
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        Enter your Order ID (e.g., ORD-123456) to view real-time delivery status.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="w-full max-w-xl relative mb-12">
                    <form onSubmit={handleTrack} className="group flex items-center bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-zinc-100 transition-shadow">
                        <Search className="w-5 h-5 text-zinc-400 ml-5 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                            placeholder="e.g. ORD-88992211"
                            className="w-full bg-transparent px-4 py-4 text-base focus:outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 font-medium tracking-wide uppercase"
                        />
                        <button
                            type="submit"
                            disabled={isTracking || !orderId}
                            className="mr-2 py-2 px-6 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black rounded-xl font-medium transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {isTracking ? (
                                <>
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white/50 border-t-white dark:border-black/50 dark:border-t-black rounded-full" />
                                    <span>Tracking</span>
                                </>
                            ) : (
                                <>
                                    Track <ChevronRight className="w-4 h-4 ml-1" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Timeline Results */}
                <AnimatePresence>
                    {hasSearched && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-xl"
                        >
                            <TimelineItem
                                status="confirmed"
                                currentStatus={currentStatus}
                                title="Order Confirmed"
                                description="We have received your order and payment was successful."
                                icon={CheckCircle2}
                                date="Oct 24, 10:30 AM"
                            />
                            <TimelineItem
                                status="packed"
                                currentStatus={currentStatus}
                                title="Item Packed securely"
                                description="Your item lies safely in our secure packaging waiting for pickup."
                                icon={Package}
                                date="Oct 24, 02:15 PM"
                            />
                            <TimelineItem
                                status="shipped"
                                currentStatus={currentStatus}
                                title="Shipped"
                                description="Your order is on the way. You can track its location with the courier."
                                icon={Truck}
                                date="Oct 25, 09:00 AM"
                                trackingInfo={{
                                    courier: "DTDC Logistics",
                                    awb: "DTD99882211IN"
                                }}
                            />
                            <TimelineItem
                                status="delivered"
                                currentStatus={currentStatus}
                                title="Out for Delivery"
                                description="Your package will be delivered by today end of day."
                                icon={MapPin}
                                isLast
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
