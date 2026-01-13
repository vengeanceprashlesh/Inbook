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
    MoreHorizontal
} from "lucide-react";

const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/explore", icon: Search, label: "Search" },
    { href: "/reels", icon: Film, label: "Reels" },
    { href: "/create", icon: PlusSquare, label: "Create" },
    { href: "/profile", icon: User, label: "Profile" },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass pb-safe md:hidden transition-all duration-300">
            <div className="flex items-center justify-around h-[54px]">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center p-2 transition-transform active:scale-95 ${isActive ? "text-white" : "text-[#a8a8a8]"
                                }`}
                        >
                            <Icon
                                size={24}
                                strokeWidth={isActive ? 2.5 : 1.5}
                                className={isActive && item.href !== "/profile" ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}
                            />
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

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

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[72px] xl:w-[244px] border-r border-[#262626] bg-black flex-col py-8 px-3 transition-all duration-300">
            {/* Logo */}
            <Link href="/" className="px-3 mb-8 transition-opacity hover:opacity-80 block group">
                <span className="hidden xl:block text-2xl font-bold tracking-tight instagram-gradient-text">
                    Inbook
                </span>
                <span className="xl:hidden group-hover:scale-110 transition-transform block">
                    <svg aria-label="Instagram" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24" className="text-white">
                        <title>Inbook</title>
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
                            className={`group flex items-center gap-4 px-3 py-3 rounded-lg transition-all hover:bg-white/10 ${isActive ? "font-bold text-white" : "text-white font-normal group-hover:pl-4"
                                }`}
                        >
                            <div className="relative">
                                <Icon
                                    size={24}
                                    strokeWidth={isActive ? 2.75 : 1.75}
                                    className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-white"}`}
                                />
                                {isActive && (
                                    <div className="absolute inset-0 bg-white/20 blur-lg rounded-full opacity-50" />
                                )}
                            </div>
                            <span className="hidden xl:block transition-all duration-300">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* More menu */}
            <div className="mt-auto">
                <button className="flex items-center gap-4 px-3 py-3 rounded-lg transition-all hover:bg-white/10 w-full group">
                    <Menu
                        size={24}
                        strokeWidth={1.75}
                        className="transition-transform group-hover:scale-110"
                    />
                    <span className="hidden xl:block transition-all group-hover:pl-1">More</span>
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
        <div className="min-h-screen bg-black text-white">
            <Sidebar />
            <main className="md:ml-[72px] xl:ml-[244px] pb-[calc(54px+env(safe-area-inset-bottom))] md:pb-0 min-h-screen relative">
                {children}
            </main>
            <MobileNav />
        </div>
    );
}
