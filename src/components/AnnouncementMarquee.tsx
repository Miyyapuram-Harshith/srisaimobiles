"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';

interface MarqueeSettings {
    active: boolean;
    text: string;
    link: string;
    color: string;
    fontFamily: string;
    backgroundColor: string;
    speed: number;
    direction: 'left' | 'right';
    fontSize: string;
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    pauseOnHover?: boolean;
    repeatCount?: number;
    letterSpacing?: string;
    borderBottom?: string;
    borderTop?: string;
    textShadow?: string;
    barHeight?: string;
    opacity?: number;
}

interface AnnouncementMarqueeClientProps {
    marquee: MarqueeSettings;
}

export default function AnnouncementMarqueeClient({ marquee }: AnnouncementMarqueeClientProps) {
    const [paused, setPaused] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);

    if (!marquee || !marquee.active) return null;

    const repeat = Math.max(1, marquee.repeatCount ?? 3);

    const textStyle: React.CSSProperties = {
        color: marquee.color,
        fontFamily: marquee.fontFamily,
        fontSize: marquee.fontSize || "16px",
        fontWeight: marquee.fontWeight || "normal",
        fontStyle: marquee.fontStyle || "normal",
        letterSpacing: marquee.letterSpacing || "normal",
        textShadow: marquee.textShadow !== "none" ? marquee.textShadow : undefined,
    };

    const animationStyle: React.CSSProperties = {
        animationDuration: `${marquee.speed || 15}s`,
        animationDirection: marquee.direction === 'right' ? 'reverse' : 'normal',
        animationPlayState: paused ? 'paused' : 'running',
    };

    const barStyle: React.CSSProperties = {
        backgroundColor: marquee.backgroundColor || "#000000",
        borderBottom: marquee.borderBottom || undefined,
        borderTop: marquee.borderTop || undefined,
        height: marquee.barHeight || "40px",
        opacity: marquee.opacity ?? 1,
    };

    // Build a single "set" of repeated text nodes
    const buildSet = (keyPrefix: string) =>
        Array.from({ length: repeat }, (_, i) => {
            const content = (
                <span style={textStyle} className="px-8 whitespace-nowrap">
                    {marquee.text}
                </span>
            );
            if (marquee.link) {
                return (
                    <Link key={`${keyPrefix}-${i}`} href={marquee.link} className="hover:opacity-75 transition-opacity" tabIndex={-1}>
                        {content}
                    </Link>
                );
            }
            return <span key={`${keyPrefix}-${i}`}>{content}</span>;
        });

    return (
        <div
            style={barStyle}
            className="w-full overflow-hidden relative z-[60] flex items-center"
            onMouseEnter={() => marquee.pauseOnHover && setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/*
             * Seamless loop trick: render two identical sets side-by-side.
             * Animation goes from translateX(0) → translateX(-50%), which
             * means when set-1 exits left, set-2 (identical) takes its place.
             * The reset at 0% is invisible, giving a true infinite scroll.
             */}
            <div
                ref={trackRef}
                className="animate-marquee flex shrink-0"
                style={animationStyle}
            >
                {buildSet('a')}
                {buildSet('b')}
            </div>
        </div>
    );
}
