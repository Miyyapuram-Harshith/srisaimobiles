"use client";

import { useState, useEffect } from "react";
import {
    Palette, Megaphone, Save, Moon, Sun, Type, Link as LinkIcon,
    Gauge, AlignLeft, Eye, EyeOff, Repeat2, LetterText, Minus, Sparkles, Sliders
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Text shadow presets
const SHADOW_PRESETS = [
    { label: "None", value: "none" },
    { label: "Soft Glow", value: "0 0 8px rgba(255,255,255,0.6)" },
    { label: "Hard Drop", value: "2px 2px 0px rgba(0,0,0,0.8)" },
    { label: "Neon Blue", value: "0 0 10px #00f, 0 0 20px #00f" },
    { label: "Neon Pink", value: "0 0 10px #f0f, 0 0 20px #f0f" },
    { label: "Gold Glow", value: "0 0 8px #ffd700, 0 0 16px #ffa500" },
];

export default function StoreSettingsPage() {
    const [primaryColor, setPrimaryColor] = useState("#000000");
    const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">("system");
    const [isSaving, setIsSaving] = useState(false);

    // Marquee State
    const [marqueeActive, setMarqueeActive] = useState(true);
    const [marqueeText, setMarqueeText] = useState("");
    const [marqueeLink, setMarqueeLink] = useState("");
    const [marqueeColor, setMarqueeColor] = useState("#ffffff");
    const [marqueeFont, setMarqueeFont] = useState("sans-serif");
    const [marqueeBgColor, setMarqueeBgColor] = useState("#000000");
    const [marqueeSpeed, setMarqueeSpeed] = useState(15);
    const [marqueeDirection, setMarqueeDirection] = useState<"left" | "right">("left");
    const [marqueeFontSize, setMarqueeFontSize] = useState("16px");

    // New features
    const [marqueeFontWeight, setMarqueeFontWeight] = useState<"normal" | "bold">("normal");
    const [marqueeFontStyle, setMarqueeFontStyle] = useState<"normal" | "italic">("normal");
    const [marqueePauseOnHover, setMarqueePauseOnHover] = useState(true);
    const [marqueeRepeatCount, setMarqueeRepeatCount] = useState(3);
    const [marqueeLetterSpacing, setMarqueeLetterSpacing] = useState("normal");
    const [marqueeBorderBottom, setMarqueeBorderBottom] = useState("");
    const [marqueeBorderTop, setMarqueeBorderTop] = useState("");
    const [marqueeTextShadow, setMarqueeTextShadow] = useState("none");
    const [marqueeBarHeight, setMarqueeBarHeight] = useState("40px");
    const [marqueeOpacity, setMarqueeOpacity] = useState(1);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data?.marquee) {
                        const m = data.marquee;
                        setMarqueeActive(m.active);
                        setMarqueeText(m.text);
                        setMarqueeLink(m.link || "");
                        setMarqueeColor(m.color || "#ffffff");
                        setMarqueeFont(m.fontFamily || "sans-serif");
                        setMarqueeBgColor(m.backgroundColor || "#000000");
                        setMarqueeSpeed(m.speed || 15);
                        setMarqueeDirection(m.direction || "left");
                        setMarqueeFontSize(m.fontSize || "16px");
                        // New fields
                        setMarqueeFontWeight(m.fontWeight || "normal");
                        setMarqueeFontStyle(m.fontStyle || "normal");
                        setMarqueePauseOnHover(m.pauseOnHover ?? true);
                        setMarqueeRepeatCount(m.repeatCount ?? 3);
                        setMarqueeLetterSpacing(m.letterSpacing || "normal");
                        setMarqueeBorderBottom(m.borderBottom || "");
                        setMarqueeBorderTop(m.borderTop || "");
                        setMarqueeTextShadow(m.textShadow || "none");
                        setMarqueeBarHeight(m.barHeight || "40px");
                        setMarqueeOpacity(m.opacity ?? 1);
                    }
                }
            } catch (err) {
                console.error("Failed to load settings:", err);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    marquee: {
                        active: marqueeActive,
                        text: marqueeText,
                        link: marqueeLink,
                        color: marqueeColor,
                        fontFamily: marqueeFont,
                        backgroundColor: marqueeBgColor,
                        speed: marqueeSpeed,
                        direction: marqueeDirection,
                        fontSize: marqueeFontSize,
                        fontWeight: marqueeFontWeight,
                        fontStyle: marqueeFontStyle,
                        pauseOnHover: marqueePauseOnHover,
                        repeatCount: marqueeRepeatCount,
                        letterSpacing: marqueeLetterSpacing,
                        borderBottom: marqueeBorderBottom,
                        borderTop: marqueeBorderTop,
                        textShadow: marqueeTextShadow,
                        barHeight: marqueeBarHeight,
                        opacity: marqueeOpacity,
                    }
                })
            });
            if (res.ok) {
                toast.success("Store configurations updated successfully!");
            } else {
                toast.error("Failed to update settings.");
            }
        } catch (error) {
            toast.error("Network error while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    // Live preview helpers
    const previewTextStyle: React.CSSProperties = {
        color: marqueeColor,
        fontFamily: marqueeFont,
        fontSize: marqueeFontSize,
        fontWeight: marqueeFontWeight,
        fontStyle: marqueeFontStyle,
        letterSpacing: marqueeLetterSpacing,
        textShadow: marqueeTextShadow !== "none" ? marqueeTextShadow : undefined,
    };
    const previewBarStyle: React.CSSProperties = {
        backgroundColor: marqueeBgColor,
        borderBottom: marqueeBorderBottom || undefined,
        borderTop: marqueeBorderTop || undefined,
        height: marqueeBarHeight,
        opacity: marqueeOpacity,
    };
    const previewAnimStyle: React.CSSProperties = {
        animationDuration: `${marqueeSpeed}s`,
        animationDirection: marqueeDirection === 'right' ? 'reverse' : 'normal',
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
                                            {mode === "system" && <Palette className="w-4 h-4" />}
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
                            <h2 className="text-lg font-semibold tracking-tight">Top Announcement Marquee</h2>
                            <p className="text-sm text-zinc-500">The scrolling banner at the top of the public website.</p>
                        </div>
                    </div>

                    <div className="space-y-6">

                        {/* ── Active Toggle ── */}
                        <div className="flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={marqueeActive}
                                    onChange={(e) => setMarqueeActive(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                                <span className="ml-3 text-sm font-medium text-zinc-900 dark:text-zinc-300">
                                    Show Announcement Bar
                                </span>
                            </label>
                        </div>

                        {/* ── Text and Link ── */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2"><Type className="w-3 h-3" /> Content</p>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                                        <Type className="w-4 h-4" /> Message Text
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={marqueeText}
                                        onChange={(e) => setMarqueeText(e.target.value)}
                                        placeholder="e.g. 🎉 Grand Diwali Sale Extravaganza!"
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                                        <LinkIcon className="w-4 h-4" /> Destination Hyperlink
                                    </label>
                                    <input
                                        type="text"
                                        value={marqueeLink}
                                        onChange={(e) => setMarqueeLink(e.target.value)}
                                        placeholder="e.g. /products or https://..."
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm"
                                    />
                                    <p className="text-xs text-zinc-500 mt-2">Leave blank if no link is needed.</p>
                                </div>
                            </div>
                        </div>

                        {/* ── Colors ── */}
                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2"><Palette className="w-3 h-3" /> Colors</p>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Text Color</label>
                                    <div className="flex gap-3 items-center">
                                        <input type="color" value={marqueeColor} onChange={(e) => setMarqueeColor(e.target.value)}
                                            className="w-12 h-12 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 cursor-pointer p-1 bg-transparent"
                                        />
                                        <input type="text" value={marqueeColor} onChange={(e) => setMarqueeColor(e.target.value)}
                                            placeholder="#ffffff"
                                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-mono text-sm uppercase"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Background Color</label>
                                    <div className="flex gap-3 items-center">
                                        <input type="color" value={marqueeBgColor} onChange={(e) => setMarqueeBgColor(e.target.value)}
                                            className="w-12 h-12 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 cursor-pointer p-1 bg-transparent"
                                        />
                                        <input type="text" value={marqueeBgColor} onChange={(e) => setMarqueeBgColor(e.target.value)}
                                            placeholder="#000000"
                                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-mono text-sm uppercase"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Typography ── */}
                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2"><LetterText className="w-3 h-3" /> Typography</p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Font Family</label>
                                    <select value={marqueeFont} onChange={(e) => setMarqueeFont(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm"
                                    >
                                        <option value="sans-serif">Modern Sans-Serif</option>
                                        <option value="serif">Classic Serif</option>
                                        <option value="monospace">Monospace</option>
                                        <option value="'Comic Sans MS', cursive">Comic / Casual</option>
                                        <option value="Georgia, serif">Georgia</option>
                                        <option value="'Courier New', monospace">Courier New</option>
                                        <option value="Impact, sans-serif">Impact</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Font Size</label>
                                    <select value={marqueeFontSize} onChange={(e) => setMarqueeFontSize(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm"
                                    >
                                        <option value="11px">XS (11px)</option>
                                        <option value="13px">Small (13px)</option>
                                        <option value="14px">Normal (14px)</option>
                                        <option value="16px">Medium (16px)</option>
                                        <option value="18px">Large (18px)</option>
                                        <option value="20px">XL (20px)</option>
                                        <option value="24px">XXL (24px)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Font Weight</label>
                                    <div className="flex rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                                        {(["normal", "bold"] as const).map(w => (
                                            <button key={w} onClick={() => setMarqueeFontWeight(w)}
                                                className={`flex-1 py-2.5 text-sm font-medium transition-colors capitalize ${marqueeFontWeight === w ? "bg-zinc-900 dark:bg-white text-white dark:text-black" : "bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"}`}>
                                                {w === "bold" ? "Bold" : "Regular"}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Font Style</label>
                                    <div className="flex rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                                        {(["normal", "italic"] as const).map(s => (
                                            <button key={s} onClick={() => setMarqueeFontStyle(s)}
                                                className={`flex-1 py-2.5 text-sm font-medium transition-colors capitalize ${marqueeFontStyle === s ? "bg-zinc-900 dark:bg-white text-white dark:text-black" : "bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"}`}>
                                                {s === "italic" ? <em>Italic</em> : "Normal"}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Letter Spacing */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Letter Spacing</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: "Default", value: "normal" },
                                        { label: "Tight", value: "-0.05em" },
                                        { label: "Normal", value: "0em" },
                                        { label: "Wide", value: "0.05em" },
                                        { label: "Wider", value: "0.1em" },
                                        { label: "Widest", value: "0.2em" },
                                    ].map(opt => (
                                        <button key={opt.value} onClick={() => setMarqueeLetterSpacing(opt.value)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${marqueeLetterSpacing === opt.value ? "bg-zinc-900 dark:bg-white text-white dark:text-black border-transparent" : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"}`}>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Animation ── */}
                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2"><Gauge className="w-3 h-3" /> Animation & Behavior</p>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                                        Scroll Speed — <span className="font-mono text-blue-600">{marqueeSpeed}s</span> loop
                                    </label>
                                    <input type="range" min="3" max="60" step="1"
                                        value={marqueeSpeed}
                                        onChange={(e) => setMarqueeSpeed(parseInt(e.target.value))}
                                        className="w-full accent-black dark:accent-white"
                                    />
                                    <div className="flex justify-between text-xs text-zinc-400 mt-1">
                                        <span>3s (Fastest)</span><span>60s (Slowest)</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Scroll Direction</label>
                                    <div className="flex rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                                        {([{ v: "left", l: "← Right to Left" }, { v: "right", l: "Right to Left →" }] as const).map(d => (
                                            <button key={d.v} onClick={() => setMarqueeDirection(d.v as "left" | "right")}
                                                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${marqueeDirection === d.v ? "bg-zinc-900 dark:bg-white text-white dark:text-black" : "bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"}`}>
                                                {d.l}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Repeat Count */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                        <Repeat2 className="w-4 h-4" /> Text Repetitions — <span className="font-mono text-blue-600">{marqueeRepeatCount}×</span>
                                    </label>
                                    <input type="range" min="1" max="10" step="1"
                                        value={marqueeRepeatCount}
                                        onChange={(e) => setMarqueeRepeatCount(parseInt(e.target.value))}
                                        className="w-full accent-black dark:accent-white"
                                    />
                                    <p className="text-xs text-zinc-500 mt-1">How many times the text repeats in the scrolling track.</p>
                                </div>

                                {/* Pause on Hover */}
                                <div className="flex flex-col justify-center">
                                    <label className="block text-sm font-medium mb-3 text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                        {marqueePauseOnHover ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />} Pause on Mouse Hover
                                    </label>
                                    <label className="relative inline-flex items-center cursor-pointer w-fit">
                                        <input type="checkbox" className="sr-only peer"
                                            checked={marqueePauseOnHover}
                                            onChange={(e) => setMarqueePauseOnHover(e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                        <span className="ml-3 text-sm text-zinc-600 dark:text-zinc-400">
                                            {marqueePauseOnHover ? "Enabled — pauses on hover" : "Disabled — always scrolling"}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* ── Bar Appearance ── */}
                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2"><Sliders className="w-3 h-3" /> Bar Appearance</p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Bar Height */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Bar Height</label>
                                    <select value={marqueeBarHeight} onChange={(e) => setMarqueeBarHeight(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm"
                                    >
                                        <option value="28px">Compact (28px)</option>
                                        <option value="36px">Small (36px)</option>
                                        <option value="40px">Default (40px)</option>
                                        <option value="48px">Medium (48px)</option>
                                        <option value="56px">Large (56px)</option>
                                        <option value="64px">Extra Large (64px)</option>
                                    </select>
                                </div>

                                {/* Opacity */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                                        Bar Opacity — <span className="font-mono text-blue-600">{Math.round(marqueeOpacity * 100)}%</span>
                                    </label>
                                    <input type="range" min="0.1" max="1" step="0.05"
                                        value={marqueeOpacity}
                                        onChange={(e) => setMarqueeOpacity(parseFloat(e.target.value))}
                                        className="w-full accent-black dark:accent-white"
                                    />
                                </div>

                                {/* Text Shadow */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" /> Text Glow / Shadow
                                    </label>
                                    <select value={marqueeTextShadow} onChange={(e) => setMarqueeTextShadow(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm"
                                    >
                                        {SHADOW_PRESETS.map(p => (
                                            <option key={p.value} value={p.value}>{p.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Border Controls */}
                            <div className="grid md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                        <Minus className="w-4 h-4" /> Top Border (CSS)
                                    </label>
                                    <input type="text" value={marqueeBorderTop} onChange={(e) => setMarqueeBorderTop(e.target.value)}
                                        placeholder="e.g. 2px solid #ffffff"
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                        <Minus className="w-4 h-4" /> Bottom Border (CSS)
                                    </label>
                                    <input type="text" value={marqueeBorderBottom} onChange={(e) => setMarqueeBorderBottom(e.target.value)}
                                        placeholder="e.g. 1px solid rgba(255,255,255,0.3)"
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Live Preview ── */}
                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2"><Eye className="w-3 h-3" /> Live Preview</p>
                            <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                                {marqueeActive ? (
                                    <div style={previewBarStyle} className="w-full overflow-hidden flex items-center">
                                        <div className="animate-marquee flex whitespace-nowrap" style={previewAnimStyle}>
                                            {Array.from({ length: marqueeRepeatCount }, (_, i) => (
                                                <span key={i} style={previewTextStyle} className="px-8">
                                                    {marqueeText || "Your announcement text will appear here..."}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-10 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 text-sm">
                                        Announcement bar is disabled
                                    </div>
                                )}
                            </div>
                        </div>

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
