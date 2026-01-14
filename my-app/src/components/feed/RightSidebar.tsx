"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const suggestions = [
    {
        username: "prashikesh_8055",
        subtitle: "Followed by shethwanideep",
        avatarUrl: null,
    },
    {
        username: "its.saket.singh_555",
        subtitle: "Followed by ileesh7ra.jesingh",
        avatarUrl: null,
    },
    {
        username: "Kabir Gill",
        subtitle: "Suggested for you",
        avatarUrl: null,
    },
    {
        username: "Sakshi Arora",
        subtitle: "Suggested for you",
        avatarUrl: null,
    },
    {
        username: "sharma.dhyaa",
        subtitle: "Followed by pranesh_all",
        avatarUrl: null,
    },
];

const footerLinks = [
    "About", "Help", "Press", "API", "Jobs", "Privacy",
    "Terms", "Locations", "Language", "Meta Verified"
];

export function RightSidebar() {
    const currentUser = useQuery(api.users.getCurrentUser);

    if (!currentUser) return null;

    return (
        <aside className="hidden xl:block ig-right-panel">
            <div className="fixed w-[319px] px-6">
                {/* Current User */}
                <div className="flex items-center justify-between py-6">
                    <Link href={`/profile/${currentUser.username}`} className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-11 h-11 rounded-full overflow-hidden border border-[#DBDBDB] dark:border-[#262626] flex-shrink-0">
                            {currentUser.avatarUrl ? (
                                <img
                                    src={currentUser.avatarUrl}
                                    alt={currentUser.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-300 dark:bg-gray-700" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{currentUser.username}</p>
                            <p className="text-[#737373] text-sm truncate">{currentUser.displayName}</p>
                        </div>
                    </Link>
                    <button className="text-[#0095F6] text-xs font-semibold hover:text-[#00376B] flex-shrink-0">
                        Switch
                    </button>
                </div>

                {/* Suggestions Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[#737373] font-semibold text-sm">
                        Suggested for you
                    </h2>
                    <Link href="/explore/people" className="text-xs font-semibold hover:opacity-50">
                        See All
                    </Link>
                </div>

                {/* Suggestions List */}
                <div className="space-y-3 mb-8">
                    {suggestions.map((user) => (
                        <div key={user.username} className="flex items-center justify-between">
                            <Link href={`/profile/${user.username}`} className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-700 flex-shrink-0">
                                    {user.avatarUrl ? (
                                        <img
                                            src={user.avatarUrl}
                                            alt={user.username}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-tr from-gray-400 to-gray-300" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">{user.username}</p>
                                    <p className="text-[#737373] text-xs truncate">{user.subtitle}</p>
                                </div>
                            </Link>
                            <button className="text-[#0095F6] text-xs font-semibold hover:text-[#00376B] flex-shrink-0">
                                Follow
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer Links */}
                <footer className="text-xs text-[#C7C7C7] space-y-4">
                    <nav className="flex flex-wrap gap-x-1.5 gap-y-1">
                        {footerLinks.map((link, index) => (
                            <span key={link}>
                                <Link href="#" className="hover:underline">
                                    {link}
                                </Link>
                                {index < footerLinks.length - 1 && (
                                    <span className="mx-1.5">·</span>
                                )}
                            </span>
                        ))}
                    </nav>
                    <p className="text-[#C7C7C7]">© 2026 INSTAGRAM FROM META</p>
                </footer>
            </div>
        </aside>
    );
}
