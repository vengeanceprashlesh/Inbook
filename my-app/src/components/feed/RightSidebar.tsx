"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Avatar } from "../ui/Avatar";
import Link from "next/link";

export function RightSidebar() {
    const currentUser = useQuery(api.users.getCurrentUser);
    const allUsers = useQuery(api.users.getAllUsers);

    // Filter out current user
    const suggestions = allUsers
        ?.filter((u) => u._id !== currentUser?._id)
        .slice(0, 5);

    if (!currentUser) return null;

    return (
        <aside className="hidden xl:flex flex-col w-[320px] pl-4 pt-8">
            {/* Current User Switcher */}
            <div className="flex items-center justify-between mb-6">
                <Link
                    href={`/profile/${currentUser.username}`}
                    className="flex items-center gap-3 group"
                >
                    <Avatar
                        src={currentUser.avatarUrl}
                        alt={currentUser.username}
                        size="md"
                    />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#f5f5f5]">
                            {currentUser.username}
                        </span>
                        <span className="text-sm text-[#a8a8a8]">
                            {currentUser.displayName}
                        </span>
                    </div>
                </Link>
                <button className="text-xs font-semibold text-[#0095f6] hover:text-[#f5f5f5] transition-colors">
                    Switch
                </button>
            </div>

            {/* Suggestions Header */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-[#a8a8a8]">
                    Suggested for you
                </span>
                <button className="text-xs font-semibold text-[#f5f5f5] hover:text-[#a8a8a8] transition-colors">
                    See All
                </button>
            </div>

            {/* Suggestions List */}
            <div className="flex flex-col gap-3">
                {suggestions?.map((user) => (
                    <div key={user._id} className="flex items-center justify-between py-1">
                        <Link
                            href={`/profile/${user.username}`}
                            className="flex items-center gap-3 group"
                        >
                            <Avatar
                                src={user.avatarUrl}
                                alt={user.username}
                                size="sm" // Smaller than main profile
                                className="w-[44px] h-[44px]"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-[#f5f5f5]">
                                    {user.username}
                                </span>
                                <span className="text-xs text-[#a8a8a8]">
                                    Suggested for you
                                </span>
                            </div>
                        </Link>
                        <button className="text-xs font-semibold text-[#0095f6] hover:text-[#f5f5f5] transition-colors">
                            Follow
                        </button>
                    </div>
                ))}

                {/* Loading State */}
                {!suggestions && (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 py-1">
                                <div className="w-11 h-11 rounded-full skeleton" />
                                <div className="flex flex-col gap-2">
                                    <div className="w-24 h-3 skeleton" />
                                    <div className="w-16 h-2 skeleton" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="mt-8">
                <nav className="flex flex-wrap gap-x-1 gap-y-0.5 text-xs text-[#737373]">
                    {["About", "Help", "Press", "API", "Jobs", "Privacy", "Terms", "Locations", "Language", "Meta Verified"].map((link, i, arr) => (
                        <span key={link} className="flex items-center gap-1">
                            <a href="#" className="hover:underline">{link}</a>
                            {i < arr.length - 1 && <span>·</span>}
                        </span>
                    ))}
                </nav>
                <div className="mt-4 text-xs text-[#737373] uppercase">
                    © 2026 INSTAGRAM FROM META
                </div>
            </footer>
        </aside>
    );
}
