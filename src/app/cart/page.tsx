"use client";

import Navbar from "@/components/ui/Navbar";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    specifications: { storage?: string };
    condition: string;
    is_available: boolean;
}

export default function CartPage() {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(r => r.json())
            .then((data: Product[]) => {
                setProduct(data.find(p => p.is_available) || null);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
                <h1 className="text-4xl font-semibold tracking-tight text-apple-text mb-12 text-center">
                    Review your bag.
                </h1>
                {loading ? (
                    <div className="text-center py-12 text-apple-text-secondary">Loading...</div>
                ) : product ? (
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start border-b border-apple-border pb-6 sm:pb-10 mb-6 sm:mb-10">
                        <div className="w-28 sm:w-1/4 bg-apple-card rounded-xl p-3 aspect-square flex items-center justify-center flex-shrink-0">
                            {product.images?.[0]
                                ? <img src={product.images[0]} alt={product.name} className="max-w-full max-h-full mix-blend-multiply" />
                                : <div className="text-xs text-apple-text-secondary">No image</div>}
                        </div>
                        <div className="w-full md:w-3/4 flex flex-col sm:flex-row justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold text-apple-text mb-2">{product.name}</h2>
                                <p className="text-apple-text-secondary mb-4">{product.specifications?.storage} | {product.condition} condition</p>
                                <button className="text-apple-blue hover:underline text-sm font-medium">Remove</button>
                            </div>
                            <div className="mt-4 sm:mt-0 text-xl font-medium text-apple-text">
                                ₹{product.price.toLocaleString('en-IN')}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-apple-text-secondary py-12">Bag is empty.</div>
                )}
                <div className="flex flex-col items-end">
                    <div className="w-full md:w-1/2">
                        <div className="flex justify-between py-4 border-b border-apple-border text-apple-text-secondary">
                            <span>Subtotal</span>
                            <span>₹{product?.price.toLocaleString('en-IN') || 0}</span>
                        </div>
                        <div className="flex justify-between py-4 border-b border-apple-border font-medium text-apple-text text-xl">
                            <span>Total</span>
                            <span>₹{product?.price.toLocaleString('en-IN') || 0}</span>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <Link href="/checkout" className="w-full text-center px-8 py-3.5 bg-apple-blue text-white rounded-xl font-medium hover:bg-apple-blue-hover transition duration-300 active:scale-[0.98]">
                                Check Out
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
