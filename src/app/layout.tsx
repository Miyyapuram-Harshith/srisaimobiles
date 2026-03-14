import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import AnnouncementMarquee from "@/components/AnnouncementMarqueeServer";
import MobileBottomNav from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "SriSaiMobiles Retail",
  description: "Premium mobiles and electronics starting at great prices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* pb-16 on mobile leaves room for bottom nav; no extra padding on md+ */}
      <body className="antialiased selection:bg-apple-blue selection:text-white pb-16 md:pb-0">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            <AnnouncementMarquee />
            {children}
          </main>
          <MobileBottomNav />
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
