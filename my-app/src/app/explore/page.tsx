"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AppLayout } from "@/components/layout/AppLayout";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const posts = useQuery(api.posts.getExplorePosts, { limit: 30 });
    const searchResults = useQuery(
        api.users.searchUsers,
        searchQuery.length > 0 ? { searchTerm: searchQuery } : "skip"
    );

    return (
        <AppLayout>
            {/* Search header */}
            <header className="sticky top-0 z-40 bg-black px-4 py-2">
                <div className="relative">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8a8a8]"
                    />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        className="w-full px-10 py-2 bg-[#262626] rounded-lg text-sm placeholder:text-[#a8a8a8] focus:outline-none"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setIsSearchFocused(false);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            <X size={16} className="text-[#a8a8a8]" />
                        </button>
                    )}
                </div>
            </header>

            {/* Search results overlay */}
            {isSearchFocused && searchQuery && searchResults && (
                <div className="px-4 py-2 border-b border-[#262626]">
                    {searchResults.length === 0 ? (
                        <p className="text-[#a8a8a8] text-sm py-4 text-center">
                            No users found
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {searchResults.map((user) => (
                                <Link
                                    key={user._id}
                                    href={`/profile/${user.username}`}
                                    className="flex items-center gap-3 py-2 hover:bg-white/5 rounded-lg px-2 -mx-2"
                                    onClick={() => setIsSearchFocused(false)}
                                >
                                    <div className="w-11 h-11 rounded-full bg-[#262626] overflow-hidden">
                                        {user.avatarUrl ? (
                                            <Image
                                                src={user.avatarUrl}
                                                alt={user.username}
                                                width={44}
                                                height={44}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[#a8a8a8]">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{user.username}</p>
                                        <p className="text-[#a8a8a8] text-sm">{user.displayName}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Explore grid */}
            {!isSearchFocused && (
                <div className="post-grid">
                    {posts === undefined ? (
                        // Loading skeleton
                        Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="aspect-square skeleton" />
                        ))
                    ) : posts.length === 0 ? (
                        <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold mb-2">Explore</h3>
                            <p className="text-[#a8a8a8]">
                                Discover new content and creators
                            </p>
                        </div>
                    ) : (
                        posts.map((post, index) => {
                            // Create varied grid pattern like Instagram
                            const isLarge = index % 10 === 0;
                            return (
                                <Link
                                    key={post._id}
                                    href={`/p/${post._id}`}
                                    className={`relative aspect-square bg-[#1a1a1a] group ${isLarge ? "row-span-2 col-span-2" : ""
                                        }`}
                                >
                                    <Image
                                        src={post.imageUrl}
                                        alt="Post"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 33vw, 200px"
                                    />
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                                        <span className="flex items-center gap-1 font-semibold">
                                            ❤️ {post.likesCount}
                                        </span>
                                        <span className="flex items-center gap-1 font-semibold">
                                            💬 {post.commentsCount}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            )}
        </AppLayout>
    );
}
