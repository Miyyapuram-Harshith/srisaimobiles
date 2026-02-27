"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface HeroBanner {
    id: string;
    image_url: string;
    title: string;
    subtitle: string;
    link: string;
    timer_ends_at: string | null;
}

export default function StorefrontCMS() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [announcementText, setAnnouncementText] = useState("");
    const [announcementActive, setAnnouncementActive] = useState(false);
    const [banners, setBanners] = useState<HeroBanner[]>([]);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/storefront');
            if (res.ok) {
                const { data } = await res.json();
                if (data) {
                    setAnnouncementText(data.announcement_text || "");
                    setAnnouncementActive(data.announcement_active || false);
                    setBanners(data.hero_banners || []);
                }
            } else {
                toast.error("Required table 'store_settings' might be missing from Supabase.");
            }
        } catch (error) {
            toast.error("Network error loading settings.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/storefront', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    announcement_text: announcementText,
                    announcement_active: announcementActive,
                    hero_banners: banners,
                })
            });

            if (res.ok) {
                toast.success("Storefront updated successfully! Changes are now live.");
            } else {
                const data = await res.json();
                toast.error(data.error || "Saving failed.");
            }
        } catch (error) {
            toast.error("Network error while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    const addBanner = () => {
        setBanners([...banners, {
            id: Date.now().toString(),
            image_url: "",
            title: "",
            subtitle: "",
            link: "",
            timer_ends_at: null
        }]);
    };

    const updateBanner = (id: string, field: keyof HeroBanner, value: string | null) => {
        setBanners(banners.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    const removeBanner = (id: string) => {
        setBanners(banners.filter(b => b.id !== id));
    };

    if (isLoading) {
        return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-zinc-400" size={32} /></div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Storefront CMS</h1>
                    <p className="text-sm text-zinc-500 mt-1">Manage the customer homepage in real-time.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                    {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

            {/* Announcement Bar */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white flex items-center gap-2">
                    Top Announcement Bar
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={announcementActive}
                                onChange={(e) => setAnnouncementActive(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                            <span className="ml-3 text-sm font-medium text-zinc-900 dark:text-zinc-300">
                                Feature Active
                            </span>
                        </label>
                    </div>
                    <div>
                        <input
                            type="text"
                            value={announcementText}
                            onChange={(e) => setAnnouncementText(e.target.value)}
                            placeholder="e.g. 🎉 Grand Diwali Sale Extravaganza! Flat 50% Off on iPhones."
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Hero Banners */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-blue-500" />
                        Hero Banners
                    </h2>
                    <button
                        onClick={addBanner}
                        className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Banner
                    </button>
                </div>

                <div className="space-y-6">
                    {banners.map((banner, index) => (
                        <div key={banner.id} className="p-5 border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl relative group">
                            <button
                                onClick={() => removeBanner(banner.id)}
                                className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1 bg-red-50 dark:bg-red-950/20 rounded-md transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-4">Banner {index + 1}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-500 mb-1">Image URL</label>
                                        <input
                                            type="text"
                                            value={banner.image_url}
                                            onChange={(e) => updateBanner(banner.id, "image_url", e.target.value)}
                                            placeholder="https://..."
                                            className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-500 mb-1">Title overlay</label>
                                        <input
                                            type="text"
                                            value={banner.title}
                                            onChange={(e) => updateBanner(banner.id, "title", e.target.value)}
                                            placeholder="e.g. iPhone 15 Pro"
                                            className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-500 mb-1">Destination Link</label>
                                        <input
                                            type="text"
                                            value={banner.link}
                                            onChange={(e) => updateBanner(banner.id, "link", e.target.value)}
                                            placeholder="/products/123"
                                            className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-500 mb-1">Subtitle</label>
                                            <input
                                                type="text"
                                                value={banner.subtitle}
                                                onChange={(e) => updateBanner(banner.id, "subtitle", e.target.value)}
                                                placeholder="Starting at ₹49,999"
                                                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-500 mb-1">Countdown Timer Ends (Optional)</label>
                                            <input
                                                type="datetime-local"
                                                value={banner.timer_ends_at || ""}
                                                onChange={(e) => updateBanner(banner.id, "timer_ends_at", e.target.value || null)}
                                                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {banners.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                            <ImageIcon className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">No banners configured</p>
                            <p className="text-xs text-zinc-500">Click &quot;Add Banner&quot; to create your first dynamic storefront hero.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-xs font-medium border border-blue-100 dark:border-blue-900/50">
                <p>Note: You must create a `store_settings` table in Supabase with columns: <code>id (int)</code>, <code>announcement_text (text)</code>, <code>announcement_active (bool)</code>, and <code>hero_banners (jsonb)</code>.</p>
            </div>
        </div>
    );
}
