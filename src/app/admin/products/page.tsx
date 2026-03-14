"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Download, Loader2, Plus } from 'lucide-react';

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
        <button onClick={handleExport} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg font-medium transition-all text-sm disabled:opacity-60">
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            {loading ? 'Exporting…' : label}
        </button>
    );
}

interface Product {
    id: string;
    name: string;
    price: number;
    condition: string;
    is_available: boolean;
    specifications: { storage?: string; battery_health?: string };
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(r => r.json())
            .then(data => { setProducts(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-8 gap-3">
                <h1 className="text-3xl font-semibold text-[#1d1d1f]">Products</h1>
                <div className="flex items-center gap-3">
                    <ExportButton type="products" label="Export Excel" />
                    <Link href="/admin/add-product"
                        className="flex items-center gap-2 px-6 py-2 bg-[#0066cc] text-white rounded-lg font-medium hover:bg-[#0058b0] active:scale-95 transition">
                        <Plus size={16} /> Add Product
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
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-[#86868b] text-sm">Loading...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-[#86868b] text-sm">No products yet.</td></tr>
                        ) : products.map((product) => (
                            <tr key={product.id} className="border-b border-[#d2d2d7] last:border-0 hover:bg-[#f5f5f7]/50">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-[#1d1d1f]">{product.name}</div>
                                    <div className="text-xs text-[#86868b]">{product.condition}</div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-[#1d1d1f]">₹{product.price.toLocaleString()}</td>
                                <td className="px-6 py-4 text-sm text-[#1d1d1f]">
                                    {product.specifications?.storage || '—'} / {product.specifications?.battery_health || '—'}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {product.is_available ? (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span>
                                    ) : (
                                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Sold</span>
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
