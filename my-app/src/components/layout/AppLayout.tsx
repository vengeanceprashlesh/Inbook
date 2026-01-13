"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Search,
    PlusSquare,
    Heart,
    User,
    Compass,
    Film,
    MessageCircle,
    Menu,
} from "lucide-react";

// Nav configuration
const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/explore", icon: Search, label: "Search" },
    { href: "/reels", icon: Film, label: "Reels" },
    { href: "/create", icon: PlusSquare, label: "Create" },
    { href: "/profile", icon: User, label: "Profile" },
];

const sidebarItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/explore", icon: Search, label: "Search" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/reels", icon: Film, label: "Reels" },
    { href: "/messages", icon: MessageCircle, label: "Messages", badge: "5" },
    { href: "/notifications", icon: Heart, label: "Notifications" },
    { href: "/create", icon: PlusSquare, label: "Create" },
    { href: "/profile", icon: User, label: "Profile" },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass-header border-t border-white/10 pb-safe md:hidden transition-all duration-500 ease-out">
            <div className="flex items-center justify-around h-[60px]">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center p-2 transition-all duration-300 ${isActive ? "text-[#0095f6] scale-110" : "text-[#a8a8a8] hover:text-white"
                                }`}
                        >
                            <Icon
                                size={26}
                                strokeWidth={isActive ? 2.5 : 1.5}
                                className={isActive ? "drop-shadow-[0_0_10px_rgba(0,149,246,0.5)]" : ""}
                            />
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex sticky top-0 h-screen w-[72px] xl:w-[244px] flex-col py-8 px-3 border-r border-[#262626] bg-black z-50 transition-width duration-300">
            {/* Logo */}
            <Link href="/" className="px-3 mb-8 block group">
                {/* Desktop Logo */}
                <span className="hidden xl:block text-[24px] font-medium tracking-tight instagram-logo-font group-hover:opacity-60 transition-opacity mt-2">
                    Instagram
                </span>
                {/* Icon Logo */}
                <span className="xl:hidden group-hover:scale-105 transition-transform block mt-1">
                    <svg aria-label="Instagram" fill="white" height="24" role="img" viewBox="0 0 24 24" width="24">
                        <title>Instagram</title>
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.665-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                </span>
            </Link>

            {/* Floating Messages Pill */}
            <div className="fixed bottom-6 right-6 hidden xl:flex items-center gap-3 bg-[#262626] border border-[#363636] rounded-full px-4 py-3 shadow-2xl cursor-pointer hover:bg-[#363636] transition-colors z-50 animate-fade-in">
                <div className="relative">
                    <MessageCircle size={24} strokeWidth={2} className="text-white" />
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#ff3040] rounded-full flex items-center justify-center text-[10px] font-bold">
                        5
                    </div>
                </div>
                <span className="font-semibold text-sm mr-1">Messages</span>
                {/* Facepile */}
                <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-[#262626] bg-gray-700 overflow-hidden">
                            {/* Placeholder avatars */}
                            <div className="w-full h-full bg-gradient-to-tr from-gray-500 to-gray-400" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Nav items */}
            <nav className="flex-1 space-y-1">
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    // Instagram Home icon is filled when active
                    const isHome = item.label === "Home";
                    const shouldFill = isActive && isHome;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`group flex items-center gap-4 px-3 py-3 rounded-lg transition-transform md:justify-center xl:justify-start
                                hover:bg-white/10
                            `}
                        >
                            <div className="relative">
                                <Icon
                                    size={24}
                                    strokeWidth={isActive ? (shouldFill ? 2 : 3) : 2}
                                    fill={shouldFill ? "white" : "none"}
                                    className={`transition-transform duration-300 group-hover:scale-105 ${isActive ? "text-white" : "text-white"}`}
                                />
                                {/* Red Dot for Collapsed Mode (Messages) */}
                                {item.badge && (
                                    <div className="xl:hidden absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ff3040] rounded-full ring-2 ring-black" />
                                )}
                            </div>

                            <span className={`hidden xl:block text-[16px] transition-all ${isActive ? "font-bold" : "font-normal"}`}>
                                {item.label}
                            </span>

                            {/* Badge for Expanded Mode */}
                            {item.badge && (
                                <div className="hidden xl:flex ml-auto bg-[#ff3040] text-white text-[11px] font-bold px-2 h-[18px] items-center justify-center rounded-full">
                                    {item.badge}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* More menu */}
            <div className="mt-auto">
                <button className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all hover:bg-white/5 w-full group">
                    <Menu
                        size={26}
                        strokeWidth={1.5}
                        className="transition-transform group-hover:rotate-90 text-white"
                    />
                    <span className="hidden xl:block font-medium text-[15px] text-white transition-opacity">More</span>
                </button>
            </div>
        </aside>
    );
}

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen bg-black text-white selection:bg-[#0095f6] selection:text-white">
            <Sidebar />
            <main className="flex-1 min-w-0 pb-[calc(60px+env(safe-area-inset-bottom))] md:pb-0 relative animate-fade-in">
                {children}
            </main>
            <MobileNav />
        </div>
    );
}
