import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Define the shape of our settings
export interface SiteSettings {
    marquee: {
        active: boolean;
        text: string;
        link: string;
        color: string;
        fontFamily: string;
        backgroundColor: string;
        speed: number;
        direction: 'left' | 'right';
        fontSize: string;
        // New fields
        fontWeight: 'normal' | 'bold';
        fontStyle: 'normal' | 'italic';
        pauseOnHover: boolean;
        repeatCount: number;
        letterSpacing: string;
        borderBottom: string;
        borderTop: string;
        textShadow: string;
        barHeight: string;
        opacity: number;
    }
}

const dataFilePath = path.join(process.cwd(), 'data', 'settings.json');

// Helper to reliably read settings, filling in defaults if corrupted
async function getSettings(): Promise<SiteSettings> {
    try {
        const fileData = await fs.readFile(dataFilePath, 'utf8');
        const parsed = JSON.parse(fileData);
        // Ensure new properties have defaults if migrating from older schema
        if (parsed.marquee) {
            parsed.marquee.backgroundColor = parsed.marquee.backgroundColor || "#000000";
            parsed.marquee.speed = parsed.marquee.speed ?? 15;
            parsed.marquee.direction = parsed.marquee.direction || "left";
            parsed.marquee.fontSize = parsed.marquee.fontSize || "16px";
            // New defaults
            parsed.marquee.fontWeight = parsed.marquee.fontWeight || "normal";
            parsed.marquee.fontStyle = parsed.marquee.fontStyle || "normal";
            parsed.marquee.pauseOnHover = parsed.marquee.pauseOnHover ?? true;
            parsed.marquee.repeatCount = parsed.marquee.repeatCount ?? 3;
            parsed.marquee.letterSpacing = parsed.marquee.letterSpacing || "normal";
            parsed.marquee.borderBottom = parsed.marquee.borderBottom || "";
            parsed.marquee.borderTop = parsed.marquee.borderTop || "";
            parsed.marquee.textShadow = parsed.marquee.textShadow || "none";
            parsed.marquee.barHeight = parsed.marquee.barHeight || "40px";
            parsed.marquee.opacity = parsed.marquee.opacity ?? 1;
        }
        return parsed as SiteSettings;
    } catch (error) {
        // Fallback defaults if file doesn't exist yet
        return {
            marquee: {
                active: false,
                text: "Welcome to our store!",
                link: "",
                color: "#ffffff",
                fontFamily: "sans-serif",
                backgroundColor: "#000000",
                speed: 15,
                direction: "left",
                fontSize: "16px",
                fontWeight: "normal",
                fontStyle: "normal",
                pauseOnHover: true,
                repeatCount: 3,
                letterSpacing: "normal",
                borderBottom: "",
                borderTop: "",
                textShadow: "none",
                barHeight: "40px",
                opacity: 1,
            }
        };
    }
}

export async function GET() {
    const settings = await getSettings();
    return NextResponse.json(settings);
}

export async function POST(request: Request) {
    // Verify admin role — middleware sets this header after JWT verification
    const role = request.headers.get('x-user-role');
    if (role !== 'admin' && role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Guard against oversized payloads
        const bodyStr = JSON.stringify(body);
        if (bodyStr.length > 50_000) {
            return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
        }

        const currentSettings = await getSettings();

        // Merge incoming updates intelligently
        const newSettings: SiteSettings = {
            ...currentSettings,
            ...body,
            // Deep merge marquee object
            marquee: {
                ...currentSettings.marquee,
                ...(body.marquee || {}),
            }
        };

        await fs.writeFile(dataFilePath, JSON.stringify(newSettings, null, 2), 'utf8');

        return NextResponse.json({ success: true, settings: newSettings });
    } catch (error) {
        console.error("Error saving settings.json:", error);
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
    }
}

