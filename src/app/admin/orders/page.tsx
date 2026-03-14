"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Loader2, Package, Truck, ChevronDown, ChevronUp, CheckCircle2, User, MapPin, Send, Download } from "lucide-react";
import { toast } from "sonner";

function ExportButton({ type, label }: { type: string; label: string }) {
    const [loading, setLoading] = useState(false);
    const handleExport = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/export?type=${type}`);
            if (!res.ok) throw new Error('Export failed');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}_${new Date().toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(a); a.click(); a.remove();
            URL.revokeObjectURL(url);
        } catch { toast.error('Export failed.'); }
        finally { setLoading(false); }
    };
    return (
        <button onClick={handleExport} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg font-medium transition-all text-sm disabled:opacity-60">
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            {loading ? 'Exporting…' : label}
        </button>
    );
}

interface Order {
    id: string;
    amount: number;
    status: string;
    tracking_id: string | null;
    created_at: string;
    shipping_address: any; // JSONB
    users: { phone: string; email: string; } | null;
}

export default function OrdersDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    // Tracking tracking IDs input per order
    const [trackingInputs, setTrackingInputs] = useState<{ [key: string]: string }>({});
    const [isSaving, setIsSaving] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/orders');
            if (res.ok) {
                const { data } = await res.json();
                setOrders(data || []);
            }
        } catch (error) {
            toast.error("Failed to load orders.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateTracking = async (orderId: string) => {
        const trackingId = trackingInputs[orderId];
        if (!trackingId || trackingId.trim() === "") {
            toast.error("Please enter a valid tracking ID first.");
            return;
        }

        setIsSaving({ ...isSaving, [orderId]: true });

        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: orderId, tracking_id: trackingId, status: 'Dispatched' })
            });

            if (res.ok) {
                toast.success(`Order ${orderId.substring(0, 8)} marked as Dispatched!`);
                // Update local state
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Dispatched', tracking_id: trackingId } : o));
            } else {
                toast.error("Failed to update tracking info.");
            }
        } catch (error) {
            toast.error("Network error.");
        } finally {
            setIsSaving({ ...isSaving, [orderId]: false });
        }
    };

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.users?.phone && o.users.phone.includes(searchQuery))
    );

    return (
        <div className="space-y-6 pb-20">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Fulfillment Hub</h1>
                    <p className="text-sm text-zinc-500 mt-1">Process shipments and attach tracking IDs.</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <ExportButton type="orders" label="Export Orders" />
                    <ExportButton type="inventory" label="Export Inventory" />
                </div>
            </div>

            {/* Main Area */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">

                {/* Search / Filter Bar */}
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search by Order ID or Phone number..."
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        />
                    </div>
                </div>

                {/* Orders List */}
                <div className="flex-1 overflow-y-auto bg-zinc-50/50 dark:bg-zinc-950/50 p-4 sm:p-6">
                    {isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center p-20 text-zinc-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
                            <p className="text-sm font-medium">Fetching secure payments...</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-w-4xl mx-auto">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => {
                                    const isExpanded = expandedOrderId === order.id;
                                    const isDispatched = order.status === 'Dispatched' || !!order.tracking_id;

                                    return (
                                        <div
                                            key={order.id}
                                            className={`bg-white dark:bg-zinc-900 border transition-all rounded-2xl overflow-hidden shadow-sm hover:shadow-md ${isExpanded ? 'border-blue-500 ring-1 ring-blue-500/50' : 'border-zinc-200 dark:border-zinc-800'}`}
                                        >
                                            {/* Summary Rows */}
                                            <div
                                                className="px-5 py-4 flex items-center justify-between cursor-pointer"
                                                onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDispatched ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                                        {isDispatched ? <CheckCircle2 className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                                                            Order #{order.id.slice(0, 8).toUpperCase()}
                                                        </h3>
                                                        <p className="text-xs text-zinc-500 font-medium">
                                                            {new Date(order.created_at).toLocaleString()} • ₹{(order.amount / 100).toLocaleString('en-IN')}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <div className="hidden sm:block text-right">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${isDispatched
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50'
                                                                : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50'
                                                            }`}>
                                                            {isDispatched ? 'Dispatched' : 'Pending'}
                                                        </span>
                                                    </div>
                                                    <div className="text-zinc-400">
                                                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded Detailed View */}
                                            {isExpanded && (
                                                <div className="px-5 py-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/20">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                                        {/* Left Col: Customer Info */}
                                                        <div className="space-y-6">
                                                            <div>
                                                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                                                                    <User className="w-4 h-4" /> Customer Details
                                                                </h4>
                                                                <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                                                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Contact</p>
                                                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Phone: {order.users?.phone || 'N/A'}</p>
                                                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Email: {order.users?.email || 'N/A'}</p>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                                                                    <MapPin className="w-4 h-4" /> Delivery Address
                                                                </h4>
                                                                <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                                                                    {order.shipping_address ? (
                                                                        <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                                                                            <p className="font-semibold text-zinc-900 dark:text-white">{order.shipping_address.name}</p>
                                                                            <p>{order.shipping_address.street}</p>
                                                                            <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}</p>
                                                                        </div>
                                                                    ) : (
                                                                        <p className="text-sm text-zinc-500 italic">No shipping address recorded</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Right Col: Dispatch Action */}
                                                        <div>
                                                            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                                                                <Truck className="w-4 h-4" /> Logistics Fulfillment
                                                            </h4>

                                                            <div className="p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                                                                {isDispatched ? (
                                                                    <div>
                                                                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                                                                            <CheckCircle2 className="w-5 h-5" />
                                                                            Successfully Dispatched
                                                                        </div>
                                                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Active Tracking ID:</p>
                                                                        <code className="text-lg font-mono font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 px-3 py-1 rounded border border-zinc-200 dark:border-zinc-700">
                                                                            {order.tracking_id}
                                                                        </code>
                                                                    </div>
                                                                ) : (
                                                                    <div className="space-y-4">
                                                                        <p className="text-sm text-blue-800 dark:text-blue-300 font-medium leading-relaxed">
                                                                            Package the device securely and generate a tracking ID through your courier partner (e.g. DTDC, BlueDart).
                                                                        </p>
                                                                        <div>
                                                                            <label className="block text-xs font-bold text-blue-900 dark:text-blue-400 mb-1">Enter Courier Tracking ID</label>
                                                                            <input
                                                                                type="text"
                                                                                value={trackingInputs[order.id] || ""}
                                                                                onChange={(e) => setTrackingInputs({ ...trackingInputs, [order.id]: e.target.value })}
                                                                                placeholder="e.g. X123456789IN"
                                                                                className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono font-bold text-zinc-900 dark:text-white"
                                                                            />
                                                                        </div>
                                                                        <button
                                                                            onClick={() => handleUpdateTracking(order.id)}
                                                                            disabled={isSaving[order.id]}
                                                                            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all disabled:opacity-70"
                                                                        >
                                                                            {isSaving[order.id] ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                                                                            Confirm Dispatch
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-20 px-4">
                                    <Package className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">No orders found</h3>
                                    <p className="text-sm text-zinc-500">Wait for customers to complete Razorpay checkouts.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
