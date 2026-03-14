import React from 'react';
import { headers } from 'next/headers';
import AnnouncementMarqueeClient from './AnnouncementMarquee';

async function getMarqueeSettings() {
    try {
        const headersList = await headers();
        const host = headersList.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';

        const res = await fetch(`${protocol}://${host}/api/settings`, {
            next: { revalidate: 10 }
        });

        if (res.ok) {
            const data = await res.json();
            return data.marquee;
        }
    } catch (err) {
        console.error("Failed to load marquee settings:", err);
    }
    return null;
}

export default async function AnnouncementMarqueeServer() {
    const marquee = await getMarqueeSettings();
    if (!marquee || !marquee.active) return null;
    return <AnnouncementMarqueeClient marquee={marquee} />;
}
