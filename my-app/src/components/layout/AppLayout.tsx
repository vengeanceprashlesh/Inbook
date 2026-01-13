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
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-[#262626] pb-safe md:hidden">
            <div className="flex items-center justify-around h-12">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center p-2 ${isActive ? "text-white" : "text-[#a8a8a8]"
                                }`}
                        >
                            <Icon
                                size={24}
                                strokeWidth={isActive ? 2.5 : 1.5}
                                fill={isActive && item.href === "/" ? "white" : "none"}
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
        <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[72px] xl:w-[244px] border-r border-[#262626] bg-black flex-col py-6 px-3">
            {/* Logo */}
            <Link href="/" className="px-3 pt-6 pb-4 mb-4">
                <span className="hidden xl:block text-xl font-semibold instagram-gradient-text">
                    Inbook
                </span>
                <span className="xl:hidden text-2xl">📸</span>
            </Link>

            {/* Nav items */}
            <nav className="flex-1 space-y-1">
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-colors hover:bg-white/10 ${isActive ? "font-bold" : ""
                                }`}
                        >
                            <Icon
                                size={24}
                                strokeWidth={isActive ? 2.5 : 1.5}
                                fill={isActive && item.href === "/" ? "white" : "none"}
                            />
                            <span className="hidden xl:block">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* More menu */}
            <div className="mt-auto">
                <button className="flex items-center gap-4 px-3 py-3 rounded-lg transition-colors hover:bg-white/10 w-full">
                    <div className="w-6 h-6 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white rounded flex items-center justify-center">
                            <div className="w-0.5 h-2 bg-white" />
                        </div>
                    </div>
                    <span className="hidden xl:block">More</span>
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
        <div className="min-h-screen bg-black">
            <Sidebar />
            <main className="md:ml-[72px] xl:ml-[244px] pb-16 md:pb-0">
                {children}
            </main>
            <MobileNav />
        </div>
    );
}
