"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Search,
    Compass,
    Clapperboard,
    Send,
    Heart,
    PlusSquare,
    User,
    Menu,
} from "lucide-react";

const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/explore", icon: Search, label: "Search" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/reels", icon: Clapperboard, label: "Reels" },
    { href: "/messages", icon: Send, label: "Messages", badge: 4 },
    { href: "/notifications", icon: Heart, label: "Notifications" },
    { href: "/create", icon: PlusSquare, label: "Create" },
    { href: "/profile", icon: User, label: "Profile" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block fixed left-0 top-0 h-screen w-[245px] border-r border-[#DBDBDB] bg-white z-50">
                {/* Logo */}
                <div className="h-[60px] flex items-center px-6 border-b border-[#DBDBDB]">
                    <Link href="/" className="text-2xl font-semibold">Instagram</Link>
                </div>

                {/* Navigation */}
                <nav className="py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-4 px-6 py-3 mb-1 transition-colors relative
                                    ${isActive ? 'font-bold' : 'font-normal'}
                                    hover:bg-[#FAFAFA]
                                `}
                            >
                                <Icon
                                    size={26}
                                    strokeWidth={isActive ? 2.5 : 1.75}
                                    fill={isActive && item.label === "Home" ? "currentColor" : "none"}
                                />
                                <span className="text-base">{item.label}</span>
                                {item.badge && (
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 bg-[#FF3040] text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* More button */}
                <button className="flex items-center gap-4 px-6 py-3 mt-auto hover:bg-[#FAFAFA] w-full transition-colors">
                    <Menu size={26} strokeWidth={1.75} />
                    <span className="text-base">More</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="md:ml-[245px]">
                {children}
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[50px] bg-white border-t border-[#DBDBDB] z-50">
                <div className="flex items-center justify-around h-full px-2">
                    {[
                        { href: "/", icon: Home },
                        { href: "/explore", icon: Search },
                        { href: "/reels", icon: Clapperboard },
                        { href: "/create", icon: PlusSquare },
                        { href: "/profile", icon: User },
                    ].map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="p-2"
                            >
                                <Icon
                                    size={24}
                                    strokeWidth={isActive ? 2.5 : 1.75}
                                    fill={isActive && item.href === "/" ? "currentColor" : "none"}
                                />
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
