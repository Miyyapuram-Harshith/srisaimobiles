"use client";

import { LayoutDashboard, ShoppingBag, Box, Image as ImageIcon, Settings, Users, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

export default function AdminLayoutClient({ children, role }: { children: ReactNode; role: string }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const allNavItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["admin", "super_admin"] },
        { name: "Orders (OMS)", href: "/admin/orders", icon: ShoppingBag, roles: ["admin", "super_admin"] },
        { name: "Inventory", href: "/admin/inventory", icon: Box, roles: ["admin", "super_admin"] },
        { name: "Storefront (CMS)", href: "/admin/storefront", icon: ImageIcon, roles: ["super_admin"] },
        { name: "Store Settings", href: "/admin/settings", icon: Settings, roles: ["super_admin"] },
        { name: "Team", href: "/admin/team", icon: Users, roles: ["super_admin"] },
    ];

    // Filter Navigation purely based on the secure server-provided role
    const navItems = allNavItems.filter(item => item.roles.includes(role));

    const handleLogout = () => {
        toast.success("Successfully logged out. Redirecting...");
        // Mock redirect
        setTimeout(() => {
            window.location.href = "/";
        }, 1000);
    };

    const SidebarContent = () => (
        <>
            <div className="p-6">
                <div className="flex items-center gap-2 mb-1 group">
                    <img src="/logo.png" alt="SriSaiMobiles Logo" className="h-8 w-auto mix-blend-multiply dark:mix-blend-normal group-hover:drop-shadow-md transition-all duration-300" />
                    <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
                        Sri Sai Mobiles
                    </h1>
                </div>
                <p className="text-xs text-zinc-500 mt-1 font-medium tracking-wide uppercase px-1">Admin Portal</p>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isActive
                                ? "bg-black text-white dark:bg-zinc-800 dark:text-zinc-100"
                                : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? "text-white dark:text-zinc-100" : "text-zinc-500 group-hover:text-black dark:group-hover:text-white"
                                }`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl mb-2">
                    <div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex flex-col items-center justify-center font-bold text-sm">
                        S
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">Admin Account</p>
                        <p className="text-xs text-zinc-500 truncate capitalize">{role.replace('_', ' ')}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center px-4 py-2.5 mt-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex font-sans text-zinc-900 dark:text-zinc-100">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex-col fixed inset-y-0 z-20 shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile Drawer Overlay & Sidebar */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            className="lg:hidden fixed inset-y-0 left-0 w-72 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col z-50 overflow-hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content wrapper */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full relative">
                <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-semibold tracking-tight hidden sm:block">Overview</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">System Active</span>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden w-full max-w-[100vw]">
                    <div className="max-w-6xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
