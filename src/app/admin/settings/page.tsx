"use client";

import { useState } from "react";
import { Palette, Megaphone, Save, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function StoreSettingsPage() {
    const [primaryColor, setPrimaryColor] = useState("#000000");
    const [announcement, setAnnouncement] = useState("🔥 Festive Sale: Get up to ₹5,000 off on Apple Products with HDFC Cards!");
    const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">("system");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Store configurations updated successfully!");
        }, 800);
    };

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Store Settings</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Manage dynamic UI colors, themes, and global announcements.</p>
            </div>

            <div className="grid gap-8">
                {/* Dynamic Theme Controller */}
                <section className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-900 dark:text-white">
                            <Palette className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight">Theme & UI Controller</h2>
                            <p className="text-sm text-zinc-500">Pick the primary brand color applied globally to buttons/links.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-2">Primary Hex Color</label>
                                <div className="flex gap-4">
                                    <div
                                        className="w-12 h-12 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 shadow-inner"
                                        style={{ backgroundColor: primaryColor }}
                                    />
                                    <input
                                        type="text"
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="w-32 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-mono text-sm uppercase"
                                    />
                                </div>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-2">Default Theme Mode</label>
                                <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-fit">
                                    {["light", "dark", "system"].map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => setThemeMode(mode as any)}
                                            className={`px-4 py-2 text-sm font-medium capitalize rounded-lg transition-colors flex items-center gap-2 ${themeMode === mode
                                                ? "bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm"
                                                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                                                }`}
                                        >
                                            {mode === "light" && <Sun className="w-4 h-4" />}
                                            {mode === "dark" && <Moon className="w-4 h-4" />}
                                            {mode === "system" && <Palette className="w-4 h-4" />} {/* fallback icon */}
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Top Announcement Bar */}
                <section className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-900 dark:text-white">
                            <Megaphone className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight">Top Announcement Bar</h2>
                            <p className="text-sm text-zinc-500">The banner displayed at the absolute top of the public website.</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Banner Text Content</label>
                        <textarea
                            rows={2}
                            value={announcement}
                            onChange={(e) => setAnnouncement(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm resize-none"
                        />
                    </div>
                </section>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black rounded-xl font-medium transition-colors shadow-lg disabled:opacity-75 min-w-[200px]"
                    >
                        {isSaving ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-800 dark:border-zinc-500 dark:border-t-zinc-200 rounded-full" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? "Saving..." : "Save Changes Globally"}
                    </button>
                </div>
            </div>
        </div>
    );
}
