"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Search,
    Compass,
    Clapperboard as Reels,
    Send,
    Heart,
    PlusSquare,
    User,
    Menu,
    MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

const sidebarItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/explore", icon: Search, label: "Search" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/reels", icon: Reels, label: "Reels" },
    { href: "/messages", icon: Send, label: "Messages", badge: 4 },
    { href: "/notifications", icon: Heart, label: "Notifications" },
    { href: "/create", icon: PlusSquare, label: "Create" },
    { href: "/profile", icon: User, label: "Profile" },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`hidden md:block ig-sidebar ${!isExpanded ? 'w-[72px]' : 'w-[245px]'} transition-all duration-200`}>
                {/* Logo */}
                <div className="pt-6 pb-4 px-3 mb-8">
                    <Link href="/" className="block">
                        {isExpanded ? (
                            <span className="text-2xl font-semibold">Instagram</span>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                                <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z" />
                                <circle cx="18.406" cy="5.595" r="1.44" />
                            </svg>
                        )}
                    </Link>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-4 px-3 py-3 rounded-lg mb-1 transition-colors relative
                                    hover:bg-black/5 dark:hover:bg-white/10
                                    ${isActive ? 'font-bold' : 'font-normal'}
                                `}
                            >
                                <Icon
                                    size={24}
                                    strokeWidth={isActive ? 2.5 : 1.5}
                                    fill={isActive && item.label === "Home" ? "currentColor" : "none"}
                                    className="flex-shrink-0"
                                />
                                {isExpanded && (
                                    <>
                                        <span className="text-base">{item.label}</span>
                                        {item.badge && (
                                            <span className="ml-auto bg-[#FF3040] text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center">
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                                {!isExpanded && item.badge && (
                                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#FF3040] rounded-full"></span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* More Menu */}
                <div className="mt-auto pt-4">
                    <button className="flex items-center gap-4 px-3 py-3 rounded-lg w-full transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                        <Menu size={24} strokeWidth={1.5} className="flex-shrink-0" />
                        {isExpanded && <span className="text-base">More</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-[#DBDBDB] dark:border-[#262626] z-50">
                <div className="flex items-center justify-around h-[50px] px-2">
                    {[
                        { href: "/", icon: Home },
                        { href: "/explore", icon: Search },
                        { href: "/reels", icon: Reels },
                        { href: "/create", icon: PlusSquare },
                        { href: "/profile", icon: User },
                    ].map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center justify-center p-2"
                            >
                                <Icon
                                    size={24}
                                    strokeWidth={isActive ? 2.5 : 1.5}
                                    fill={isActive && item.href === "/" ? "currentColor" : "none"}
                                />
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-black">
            <Sidebar />
            <main className="ig-main-content">
                {children}
            </main>
        </div>
    );
}
