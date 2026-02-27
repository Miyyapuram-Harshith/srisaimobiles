"use client";

import { useState } from "react";
import { UploadCloud, GripVertical, Trash2, Eye, Link as LinkIcon, Plus, Save, ImageIcon, ExternalLink, Menu } from "lucide-react";
import { motion, Reorder } from "framer-motion";
import { toast } from "sonner";

type Banner = {
    id: string;
    image: string; // URL mock
    title: string;
    link: string;
    isActive: boolean;
};

const initialBanners: Banner[] = [
    { id: "b1", image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80", title: "iPhone 15 Pro Sale", link: "/category/apple", isActive: true },
    { id: "b2", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80", title: "Smartwatches Offer", link: "/category/accessories", isActive: true },
    { id: "b3", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80", title: "Samsung S24 Launch", link: "/category/samsung", isActive: false },
];

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>(initialBanners);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Slideshow display order saved globally!");
        }, 800);
    };

    const toggleStatus = (id: string, title?: string) => {
        setBanners(banners.map(b => {
            if (b.id === id) {
                toast.success(`Banner ${!b.isActive ? 'activated' : 'paused'}: ${b.title || title}`);
                return { ...b, isActive: !b.isActive };
            }
            return b;
        }));
    };

    const deleteBanner = (id: string, title?: string) => {
        setBanners(banners.filter(b => b.id !== id));
        toast.error(`Banner removed: ${title || 'Unnamed'}`);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 pb-32 md:pb-10 relative">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Hero Banners</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Manage promotions & visual slideshows across devices.</p>
                </div>
                <div className="hidden md:flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black disabled:opacity-50 rounded-xl font-medium transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
                    >
                        {isSaving ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-800 dark:border-zinc-500 dark:border-t-zinc-200 rounded-full" />
                        ) : (
                            <Save className="w-4 h-4 ml-[-2px]" />
                        )}
                        Save Display Order
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

                {/* Top/Left Col: Upload New  (Mobile top, Desktop span-4) */}
                <div className="lg:col-span-4 w-full h-fit order-2 lg:order-1">
                    <div className="bg-white dark:bg-zinc-900 p-5 md:p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-24">
                        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-zinc-400" />
                            Upload Banner
                        </h2>

                        <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700/80 rounded-2xl p-6 md:p-8 text-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                            <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                <UploadCloud className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Tap to upload image</p>
                            <p className="text-xs text-zinc-500 mt-1">PNG, JPG, WEBP (Max 5MB)</p>
                        </div>

                        <div className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 ml-1">Title (Internal)</label>
                                <input type="text" placeholder="e.g. Diwali Sale Banner" className="w-full px-4 py-3 md:py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm outline-none placeholder:text-zinc-400 font-medium" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 ml-1 flex items-center gap-1.5">
                                    <LinkIcon className="w-3.5 h-3.5" /> Destination URL
                                </label>
                                <input type="text" placeholder="/products/apple" className="w-full px-4 py-3 md:py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm outline-none placeholder:text-zinc-400 font-medium" />
                            </div>
                            <button onClick={() => toast.info("Opening upload simulator...")} className="w-full mt-2 py-3.5 md:py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl font-semibold transition-colors text-sm flex justify-center items-center gap-2 active:scale-[0.98]">
                                <Plus className="w-4 h-4 ml-[-2px]" /> Add to Slideshow
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom/Right Col: Manage Flow (Mobile bottom, Desktop span-8) */}
                <div className="lg:col-span-8 order-1 lg:order-2">
                    <div className="bg-white dark:bg-zinc-900 p-3 ms:-mx-4 md:p-6 rounded-[2rem] md:rounded-3xl border-0 md:border border-zinc-200 dark:border-zinc-800 shadow-none md:shadow-sm min-h-full">

                        <div className="flex justify-between items-center mb-5 px-2 md:px-0">
                            <h2 className="font-semibold text-lg flex items-center gap-2">
                                Slideshow Sequence
                                <span className="bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs px-2.5 py-1 rounded-full font-bold ml-1">
                                    {banners.filter(b => b.isActive).length} Active
                                </span>
                            </h2>
                        </div>

                        <Reorder.Group axis="y" values={banners} onReorder={setBanners} className="space-y-4 md:space-y-3">
                            {banners.map((banner) => (
                                <Reorder.Item
                                    key={banner.id}
                                    value={banner}
                                    // Large grab area for mobile! Very important. Apply border/shadow carefully.
                                    className={`relative flex flex-col md:flex-row items-stretch md:items-center gap-0 md:gap-4 p-0 md:p-3 rounded-2xl md:rounded-xl overflow-hidden transition-all bg-white dark:bg-zinc-950 border
                        ${banner.isActive
                                            ? "border-zinc-200 dark:border-zinc-700 shadow-sm md:shadow-none"
                                            : "border-zinc-100 dark:border-zinc-800/60 opacity-80 md:opacity-60 grayscale-[0.5]"}
                      `}
                                >
                                    {/* Mobile Header per banner */}
                                    <div className="md:hidden flex justify-between items-center px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                                        <div className="flex items-center gap-3">
                                            <div className="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-black dark:hover:text-white transition-colors touch-none flex items-center justify-center p-1 -ml-2">
                                                <Menu className="w-5 h-5 text-zinc-500" />
                                            </div>
                                            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate flex-1">{banner.title}</h3>
                                        </div>
                                        <button
                                            onClick={() => toggleStatus(banner.id, banner.title)}
                                            className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-lg transition-colors border ${banner.isActive
                                                ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800/60"
                                                : "bg-zinc-200 text-zinc-600 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                                                }`}
                                        >
                                            {banner.isActive ? "Active" : "Paused"}
                                        </button>
                                    </div>

                                    {/* Desktop drag handle */}
                                    <div className="hidden md:flex cursor-grab active:cursor-grabbing p-2 pl-3 text-zinc-400 hover:text-black dark:hover:text-white transition-colors h-full items-center touch-none">
                                        <GripVertical className="w-5 h-5" />
                                    </div>

                                    {/* Image Preview Area */}
                                    <div className="relative w-full md:w-40 h-32 md:h-20 shrink-0 border-b md:border border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 md:rounded-lg overflow-hidden group/img">
                                        <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                            <Eye className="w-5 h-5 text-white" />
                                        </div>
                                    </div>

                                    {/* Content block */}
                                    <div className="flex-1 min-w-0 p-4 md:p-0 md:pr-4">
                                        <h3 className="hidden md:block font-bold text-zinc-900 dark:text-zinc-100 truncate text-[15px]">{banner.title}</h3>
                                        <div className="flex items-center gap-2 mt-0 md:mt-1.5 p-2 md:p-0 bg-zinc-50 md:bg-transparent dark:bg-zinc-900 md:dark:bg-transparent rounded-lg">
                                            <ExternalLink className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 truncate tracking-wide">
                                                {banner.link}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions Block (Desktop specific buttons + Mobile trash) */}
                                    <div className="flex items-center justify-end gap-2 px-4 pb-4 pt-1 md:p-0 w-full md:w-auto">
                                        <button
                                            onClick={() => toggleStatus(banner.id, banner.title)}
                                            className={`hidden md:block px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors ${banner.isActive
                                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400"
                                                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                                                }`}
                                        >
                                            {banner.isActive ? "Active" : "Paused"}
                                        </button>
                                        <button
                                            onClick={() => deleteBanner(banner.id, banner.title)}
                                            className="flex-1 md:flex-none py-2.5 md:p-2 text-red-500 hover:text-red-700 bg-red-50 md:bg-transparent hover:bg-red-100 dark:bg-red-950/30 md:dark:bg-transparent dark:hover:bg-red-900/40 transition-colors rounded-xl flex justify-center items-center gap-2 text-sm font-semibold"
                                        >
                                            <Trash2 className="w-4 h-4 md:w-4.5 md:h-4.5" />
                                            <span className="md:hidden">Delete Banner</span>
                                        </button>
                                    </div>

                                </Reorder.Item>
                            ))}
                        </Reorder.Group>

                        {banners.length === 0 && (
                            <div className="text-center py-16 text-zinc-500 dark:text-zinc-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl mt-4 bg-zinc-50 dark:bg-zinc-900/30 mx-4 md:mx-0">
                                <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p className="font-medium text-zinc-700 dark:text-zinc-300">Slideshow is empty</p>
                                <p className="text-sm mt-1 max-w-[200px] mx-auto">Upload a new banner image to get started.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Floating Action Bar for Mobile Save Order */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-50">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full h-14 bg-black active:bg-zinc-800 dark:bg-white dark:active:bg-zinc-200 text-white dark:text-black disabled:opacity-50 rounded-2xl font-bold transition-all shadow-lg shadow-black/20 dark:shadow-white/10 flex items-center justify-center gap-2 text-base"
                >
                    {isSaving ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-[3px] border-zinc-400 border-t-zinc-800 dark:border-zinc-500 dark:border-t-zinc-200 rounded-full" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    {isSaving ? "Saving Alignment..." : "Save Display Order"}
                </button>
            </div>

        </div>
    );
}
