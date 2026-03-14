"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Smartphone, ShoppingBag, Phone } from "lucide-react";

const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Devices", icon: Smartphone },
    { href: "/cart", label: "Cart", icon: ShoppingBag },
    { href: "/contact", label: "Contact", icon: Phone },
];

export default function MobileBottomNav() {
    const pathname = usePathname();

    // Hide on admin pages
    if (pathname.startsWith("/admin")) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-t border-gray-200/80 dark:border-gray-800/80 safe-area-pb">
            <div className="flex items-center justify-around px-2 py-1.5">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-xl min-w-[60px] transition-all duration-200 active:scale-90 ${
                                isActive
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                            }`}
                        >
                            <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${isActive ? "bg-blue-50 dark:bg-blue-900/30" : ""}`}>
                                <Icon
                                    size={22}
                                    strokeWidth={isActive ? 2.5 : 1.8}
                                    className="transition-all duration-200"
                                />
                                {isActive && (
                                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400" />
                                )}
                            </div>
                            <span className={`text-[10px] font-semibold leading-none transition-all duration-200 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
