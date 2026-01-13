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
    { href: "/messages", icon: MessageCircle, label: "Messages" },
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
        <aside className="hidden md:flex sticky top-0 h-screen w-[72px] xl:w-[280px] flex-col py-8 px-4 border-r border-white/10 bg-black/95 backdrop-blur-xl z-50">
            {/* Logo */}
            <Link href="/" className="px-2 mb-10 block group">
                <span className="hidden xl:block text-3xl font-bold tracking-tighter instagram-gradient-text transition-all duration-300 group-hover:opacity-80">
                    Inbook
                </span>
                <span className="xl:hidden group-hover:scale-110 transition-transform block p-2">
                    <svg aria-label="Instagram" fill="url(#instagramGradient)" height="28" role="img" viewBox="0 0 24 24" width="28">
                        <defs>
                            <linearGradient id="instagramGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#f09433" />
                                <stop offset="25%" stopColor="#e6683c" />
                                <stop offset="50%" stopColor="#dc2743" />
                                <stop offset="100%" stopColor="#bc1888" />
                            </linearGradient>
                        </defs>
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                </span>
            </Link>

            {/* Nav items */}
            <nav className="flex-1 space-y-2">
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`relative group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 
                                ${isActive
                                    ? "font-bold text-white bg-white/10"
                                    : "text-[#f5f5f5] hover:bg-white/5 hover:translate-x-1"
                                }`}
                        >
                            <Icon
                                size={26}
                                strokeWidth={isActive ? 2.5 : 1.5}
                                className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "text-white"}`}
                            />
                            <span className={`hidden xl:block text-[15px] tracking-wide transition-all ${isActive ? "font-bold" : "font-medium"}`}>
                                {item.label}
                            </span>
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
