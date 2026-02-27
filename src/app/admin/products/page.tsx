import { getDb } from '@/lib/db';
import Link from 'next/link';

export default async function AdminProductsPage() {
    const db = await getDb();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-semibold text-[#1d1d1f]">Products</h1>
                <Link href="/admin/add-product" className="px-6 py-2 bg-[#0066cc] text-white rounded-lg font-medium hover:bg-[#0058b0] transition">
                    Add Product
                </Link>
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
                        {db.products.map((product) => (
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
