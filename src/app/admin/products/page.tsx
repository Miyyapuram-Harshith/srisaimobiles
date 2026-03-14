"use client";

import { getDb } from '@/lib/db';
import Link from 'next/link';
import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

// This page uses server data but we also need the client export button —
// split into a server data component + client export button

// Export Button Component (client-side)
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
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch {
            alert('Export failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg font-medium transition-all text-sm disabled:opacity-60"
        >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            {loading ? 'Exporting…' : label}
        </button>
    );
}

export default async function AdminProductsPage() {
    const db = await getDb();

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-8 gap-3">
                <h1 className="text-3xl font-semibold text-[#1d1d1f]">Products</h1>
                <div className="flex items-center gap-3">
                    <ExportButton type="products" label="Export Excel" />
                    <Link href="/admin/add-product" className="px-6 py-2 bg-[#0066cc] text-white rounded-lg font-medium hover:bg-[#0058b0] active:scale-95 transition">
                        Add Product
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#d2d2d7] overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#f5f5f7] border-b border-[#d2d2d7]">
                            <th className="px-6 py-4 text-sm font-medium text-[#1d1d1f]">Title</th>
                            <th className="px-6 py-4 text-sm font-medium text-[#1d1d1f]">Price</th>
                            <th className="px-6 py-4 text-sm font-medium text-[#1d1d1f]">Storage / Health</th>
                            <th className="px-6 py-4 text-sm font-medium text-[#1d1d1f]">Status</th>
                            <th className="px-6 py-4 text-sm font-medium text-[#1d1d1f] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {db.products.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-[#86868b] text-sm">
                                    No products yet. Add your first product to get started.
                                </td>
                            </tr>
                        ) : db.products.map((product) => (
                            <tr key={product.id} className="border-b border-[#d2d2d7] last:border-0 hover:bg-[#f5f5f7]/50">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-[#1d1d1f]">{product.title}</div>
                                    <div className="text-xs text-[#86868b]">{product.condition}</div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-[#1d1d1f]">₹{product.price.toLocaleString()}</td>
                                <td className="px-6 py-4 text-sm text-[#1d1d1f]">
                                    {product.storage} / {product.batteryHealth}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {product.isSold ? (
                                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Sold</span>
                                    ) : (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-right space-x-4">
                                    <button className="text-[#0066cc] hover:underline font-medium">Edit</button>
                                    <button className="text-red-500 hover:underline font-medium">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
