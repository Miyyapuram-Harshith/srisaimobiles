"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { productSchema, ProductFormValues } from '@/lib/validations/product';
import React, { useState } from 'react';

export default function AddProductPage() {
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            category: 'Smartphone',
            condition: 'New',
            images: [],
            hasOriginalBox: false,
            hasOriginalBill: false,
            faceIdWorking: true,
            trueToneWorking: true,
        }
    });

    // Watch critical fields to conditionally render UI
    const category = watch('category');
    const brand = watch('brand');
    const condition = watch('condition');

    const onSubmit = async (data: ProductFormValues) => {
        try {
            console.log('Valid Extracted Data mapping to JSONB Specifications:', data);
            // Proceed to send to /api/admin/products
            alert("Product successfully validated & mapped. Check console.");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-8">

                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Upload New Product</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Smart context-aware product listing form</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* Section 1: Core Identity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-gray-100 dark:border-gray-700">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                            <input type="text" {...register('name')} className="w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-white px-4 py-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. iPhone 15 Pro Max" />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                            <input type="number" {...register('price')} className="w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-white px-4 py-2 focus:ring-2 focus:ring-blue-500" placeholder="80000" />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand</label>
                            <select {...register('brand')} className="w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-white px-4 py-2 focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Brand</option>
                                <option value="Apple">Apple</option>
                                <option value="Samsung">Samsung</option>
                                <option value="Xiaomi">Xiaomi</option>
                                <option value="OnePlus">OnePlus</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <select {...register('category')} className="w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-white px-4 py-2 focus:ring-2 focus:ring-blue-500">
                                <option value="Smartphone">Smartphone</option>
                                <option value="Tablet">Tablet</option>
                                <option value="Wearable">Wearable</option>
                                <option value="Accessory">Accessory</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                        </div>
                    </div>

                    {/* Section 2: Dynamic Specifications (Framer Motion Appears Here) */}
                    <AnimatePresence mode="popLayout">
                        {category === 'Smartphone' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-gray-100 dark:border-gray-700"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Storage</label>
                                    <select {...register('storage')} className="w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-white px-4 py-2 focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select Storage</option>
                                        <option value="64GB">64GB</option>
                                        <option value="128GB">128GB</option>
                                        <option value="256GB">256GB</option>
                                        <option value="512GB">512GB</option>
                                        <option value="1TB">1TB</option>
                                    </select>
                                    {errors.storage && <p className="text-red-500 text-xs mt-1">{errors.storage.message}</p>}
                                </div>

                                {brand !== 'Apple' && (
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">RAM</label>
                                        <select {...register('ram')} className="w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-white px-4 py-2 focus:ring-2 focus:ring-blue-500">
                                            <option value="">Select RAM</option>
                                            <option value="4GB">4GB</option>
                                            <option value="6GB">6GB</option>
                                            <option value="8GB">8GB</option>
                                            <option value="12GB">12GB</option>
                                            <option value="16GB">16GB</option>
                                        </select>
                                        {errors.ram && <p className="text-red-500 text-xs mt-1">{errors.ram.message}</p>}
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {category === 'Accessory' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-gray-100 dark:border-gray-700"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Accessory Type</label>
                                    <input type="text" {...register('accessoryType')} className="w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-white px-4 py-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. 20W Charger, MagSafe Case" />
                                    {errors.accessoryType && <p className="text-red-500 text-xs mt-1">{errors.accessoryType.message}</p>}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Section 3: Condition & Trust Factors */}
                    <div className="pb-8 border-b border-gray-100 dark:border-gray-700">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Product Condition</label>
                        <div className="flex gap-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" value="New" {...register('condition')} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                <span className="text-gray-700 dark:text-gray-300">Brand New (Sealed)</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" value="Used" {...register('condition')} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                <span className="text-gray-700 dark:text-gray-300">Used / Renewed</span>
                            </label>
                        </div>
                        {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition.message}</p>}

                        <AnimatePresence mode="popLayout">
                            {condition === 'Used' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10, height: 0 }}
                                    className="mt-6 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30 space-y-6"
                                >
                                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-500">Trust Factor & Checks (Mandatory for Used)</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condition Grade</label>
                                            <select {...register('trustGrade')} className="w-full rounded-lg border-amber-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white px-4 py-2 focus:ring-2 focus:ring-amber-500">
                                                <option value="">Select Grade</option>
                                                <option value="Flawless">Flawless (Like New)</option>
                                                <option value="Excellent">Excellent (Minor signs of wear)</option>
                                                <option value="Good">Good (Visible scratches)</option>
                                                <option value="Fair">Fair (Heavy wear)</option>
                                            </select>
                                            {errors.trustGrade && <p className="text-red-500 text-xs mt-1">{errors.trustGrade.message}</p>}
                                        </div>

                                        {category === 'Smartphone' && brand === 'Apple' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Battery Health (%)</label>
                                                <input type="number" {...register('batteryHealth')} className="w-full rounded-lg border-amber-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white px-4 py-2 focus:ring-2 focus:ring-amber-500" placeholder="85" />
                                                {errors.batteryHealth && <p className="text-red-500 text-xs mt-1">{errors.batteryHealth.message}</p>}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-6">
                                        <label className="flex items-center space-x-2">
                                            <input type="checkbox" {...register('hasOriginalBox')} className="w-4 h-4 text-amber-600 rounded border-amber-300" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Original Box Included</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input type="checkbox" {...register('hasOriginalBill')} className="w-4 h-4 text-amber-600 rounded border-amber-300" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Original Bill Included</span>
                                        </label>

                                        {category === 'Smartphone' && brand === 'Apple' && (
                                            <>
                                                <label className="flex items-center space-x-2">
                                                    <input type="checkbox" {...register('faceIdWorking')} className="w-4 h-4 text-amber-600 rounded border-amber-300" />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">Face ID Working</span>
                                                </label>
                                                <label className="flex items-center space-x-2">
                                                    <input type="checkbox" {...register('trueToneWorking')} className="w-4 h-4 text-amber-600 rounded border-amber-300" />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">True Tone Working</span>
                                                </label>
                                            </>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin Remarks (Internal/Customer Facing)</label>
                                        <textarea {...register('adminRemarks')} rows={2} className="w-full rounded-lg border-amber-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white px-4 py-2 focus:ring-2 focus:ring-amber-500" placeholder="Any scratches? Has the screen been replaced?"></textarea>
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Base Required Info */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Quantity</label>
                        <input type="number" {...register('stock_quantity')} defaultValue={1} className="w-full md:w-1/3 rounded-lg border-gray-300 bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-white px-4 py-2 focus:ring-2 focus:ring-blue-500" />
                        {errors.stock_quantity && <p className="text-red-500 text-xs mt-1">{errors.stock_quantity.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Description</label>
                        <textarea {...register('description')} rows={4} className="w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-white px-4 py-2 focus:ring-2 focus:ring-blue-500" placeholder="Extensive product description..."></textarea>
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Validating...' : 'Securely Add Product'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
