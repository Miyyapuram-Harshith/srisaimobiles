"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const productData = {
            title: formData.get('title'),
            price: Number(formData.get('price')),
            storage: formData.get('storage'),
            condition: formData.get('condition'),
            batteryHealth: formData.get('batteryHealth'),
            timeUsed: formData.get('timeUsed') || 'New',
            description: formData.get('description'),
            images: [formData.get('image') || '/placeholder-iphone.jpg']
        };

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
            if (res.ok) {
                router.push('/admin/products');
                router.refresh();
            } else {
                alert("Failed to add product");
            }
        } catch {
            alert("Error adding product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-semibold text-[#1d1d1f] mb-8">Add New Product</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-[#d2d2d7] space-y-6">
                <div>
                    <label className="block text-sm text-[#86868b] mb-1">Title</label>
                    <input required name="title" type="text" className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:ring-2 focus:ring-[#0066cc] outline-none" placeholder="e.g. iPhone 15 Pro Max" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-[#86868b] mb-1">Price (₹)</label>
                        <input required name="price" type="number" className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:ring-2 focus:ring-[#0066cc] outline-none" placeholder="134900" />
                    </div>
                    <div>
                        <label className="block text-sm text-[#86868b] mb-1">Storage</label>
                        <input required name="storage" type="text" className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:ring-2 focus:ring-[#0066cc] outline-none" placeholder="256GB" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-[#86868b] mb-1">Condition</label>
                        <select name="condition" className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:ring-2 focus:ring-[#0066cc] outline-none bg-white">
                            <option value="New">New</option>
                            <option value="Like New">Like New</option>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-[#86868b] mb-1">Battery Health</label>
                        <input required name="batteryHealth" type="text" className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:ring-2 focus:ring-[#0066cc] outline-none" placeholder="100%" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-[#86868b] mb-1">Time Used (e.g. New, 6 Months, 1 Year)</label>
                    <input name="timeUsed" type="text" className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:ring-2 focus:ring-[#0066cc] outline-none" placeholder="e.g. 6 Months" />
                </div>

                <div>
                    <label className="block text-sm text-[#86868b] mb-1">Image URL</label>
                    <input name="image" type="text" className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:ring-2 focus:ring-[#0066cc] outline-none" placeholder="/placeholder-iphone.jpg" />
                </div>

                <div>
                    <label className="block text-sm text-[#86868b] mb-1">Description</label>
                    <textarea required name="description" rows={4} className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:ring-2 focus:ring-[#0066cc] outline-none resize-none" placeholder="Enter product details..."></textarea>
                </div>

                <button disabled={loading} type="submit" className="w-full py-3 bg-[#0066cc] text-white rounded-lg font-medium hover:bg-[#0058b0] transition-colors disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save Product'}
                </button>
            </form>
        </div>
    );
}
