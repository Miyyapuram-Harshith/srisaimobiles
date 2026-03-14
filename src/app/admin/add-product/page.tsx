"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { productSchema, ProductFormValues } from '@/lib/validations/product';
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function AddProductPage() {
    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
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

    const images = watch('images') || [];
    
    const appendImage = (url: string) => {
        setValue('images', [...images, url]);
    };
    
    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setValue('images', newImages);
    };

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

                    {/* Section 4: Image URLs */}
                    <div className="pb-8 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Images</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Select one or more images from your device. They will be uploaded automatically.</p>
                            </div>
                        </div>
                        
                        {errors.images && <p className="text-red-500 text-xs mb-4">{errors.images.message}</p>}

                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload Local Images</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const files = e.target.files;
                                        if (!files || files.length === 0) return;

                                        // We upload files one by one (or concurrently) and append URLs
                                        for (let i = 0; i < files.length; i++) {
                                            const file = files[i];
                                            const formData = new FormData();
                                            formData.append('file', file);

                                            try {
                                                const res = await fetch('/api/upload', {
                                                    method: 'POST',
                                                    body: formData,
                                                });
                                                if (res.ok) {
                                                    const data = await res.json();
                                                    appendImage(data.url); // Add the returned local URL to the form state
                                                } else {
                                                    console.error("Failed to upload:", file.name);
                                                    alert(`Failed to upload ${file.name}`);
                                                }
                                            } catch (err) {
                                                console.error("Network error uploading:", err);
                                            }
                                        }
                                        
                                        // Reset file input so the same file could be selected again if needed
                                        e.target.value = '';
                                    }}
                                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                                      file:mr-4 file:py-2.5 file:px-4
                                      file:rounded-xl file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-blue-50 file:text-blue-700
                                      dark:file:bg-blue-900/30 dark:file:text-blue-400
                                      hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50
                                      transition-all cursor-pointer border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800"
                                />
                            </div>

                            <AnimatePresence mode="popLayout">
                                {images.map((url, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                        className="flex gap-4 items-start"
                                    >
                                        <div className="flex-1">
                                            <input
                                                {...register(`images.${index}` as const)}
                                                type="url"
                                                placeholder="https://example.com/image.jpg"
                                                className="w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-400 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                                readOnly
                                            />
                                            {errors?.images?.[index] && (
                                                <p className="text-red-500 text-xs mt-1">{errors.images[index]?.message}</p>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                                            title="Remove Image"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            {images.length === 0 && (
                                <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No images tracked in form yet. Upload images above.</p>
                                </div>
                            )}
                        </div>

                        {/* Image Preview Gallery */}
                        {watch('images') && watch('images').filter(url => url.length > 0).length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Live Preview</h4>
                                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                                    {watch('images').map((url, idx) => url ? (
                                        <div key={idx} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 snap-center">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={url}
                                                alt={`Preview ${idx + 1}`}
                                                className="object-cover w-full h-full"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Invalid+URL';
                                                }}
                                            />
                                        </div>
                                    ) : null)}
                                </div>
                            </div>
                        )}
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
