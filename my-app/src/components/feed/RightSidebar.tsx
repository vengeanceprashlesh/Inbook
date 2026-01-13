"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Avatar } from "../ui/Avatar";
import Link from "next/link";

export function RightSidebar() {
    const currentUser = useQuery(api.users.getCurrentUser);
    const allUsers = useQuery(api.users.getAllUsers);

    // Filter out current user from suggestions and limit to 5
    const suggestions = allUsers
        ?.filter((u) => u._id !== currentUser?._id)
        .slice(0, 5);

    if (!currentUser) return null;

    return (
        <aside className="hidden xl:flex flex-col w-[380px] pl-16 pt-8 z-10">
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
                        <span className="text-sm font-semibold group-hover:opacity-70 transition-opacity">
                            {currentUser.username}
                        </span>
                        <span className="text-sm text-[#a8a8a8]">
                            {currentUser.displayName}
                        </span>
                    </div>
                </Link>
                <button className="text-xs font-semibold text-[#0095f6] hover:text-white transition-colors">
                    Switch
                </button>
            </div>

            {/* Suggestions Header */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-[#a8a8a8]">
                    Suggested for you
                </span>
                <button className="text-xs font-semibold text-white hover:text-[#a8a8a8] transition-colors">
                    See All
                </button>
            </div>

            {/* Suggestions List */}
            <div className="flex flex-col gap-4">
                {suggestions?.map((user) => (
                    <div key={user._id} className="flex items-center justify-between">
                        <Link
                            href={`/profile/${user.username}`}
                            className="flex items-center gap-3 group"
                        >
                            <Avatar
                                src={user.avatarUrl}
                                alt={user.username}
                                size="sm"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold group-hover:opacity-70 transition-opacity">
                                    {user.username}
                                </span>
                                <span className="text-xs text-[#a8a8a8]">
                                    Suggested for you
                                </span>
                            </div>
                        </Link>
                        <button className="text-xs font-semibold text-[#0095f6] hover:text-white transition-colors">
                            Follow
                        </button>
                    </div>
                ))}

                {/* Loading State or Empty */}
                {!suggestions && (
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full skeleton" />
                                    <div className="flex flex-col gap-2">
                                        <div className="w-24 h-3 skeleton" />
                                        <div className="w-16 h-2 skeleton" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="mt-8 text-xs text-[#52525b] space-y-4">
                <nav className="flex flex-wrap gap-x-1 gap-y-1">
                    {["About", "Help", "Press", "API", "Jobs", "Privacy", "Terms", "Locations", "Language", "Meta Verified"].map((link) => (
                        <a key={link} href="#" className="hover:underline">{link}</a>
                    ))}
                </nav>
                <div className="uppercase">
                    © 2026 INSTAGRAM FROM META
                </div>
            </footer>
        </aside>
    );
}
