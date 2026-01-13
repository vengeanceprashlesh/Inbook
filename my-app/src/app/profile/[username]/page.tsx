"use client";

import { useState, use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AppLayout } from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/Avatar";
import {
    Settings,
    Grid3X3,
    Bookmark,
    Film,
    ArrowLeft,
    BadgeCheck,
    Link as LinkIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProfilePageProps {
    params: Promise<{ username: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
    const { username } = use(params);
    const [activeTab, setActiveTab] = useState<"posts" | "reels" | "saved">("posts");

    const user = useQuery(api.users.getUserByUsername, { username });
    const userPosts = useQuery(
        api.posts.getUserPosts,
        user ? { userId: user._id } : "skip"
    );
    const currentUser = useQuery(api.users.getCurrentUser);

    const followUser = useMutation(api.interactions.followUser);
    const unfollowUser = useMutation(api.interactions.unfollowUser);

    const isFollowing = useQuery(
        api.interactions.isFollowing,
        currentUser && user && currentUser._id !== user._id
            ? { followerId: currentUser._id, followingId: user._id }
            : "skip"
    );

    const isOwnProfile = currentUser?._id === user?._id;

    const handleFollowToggle = async () => {
        if (!currentUser || !user) return;

        if (isFollowing) {
            await unfollowUser({
                followerId: currentUser._id,
                followingId: user._id,
            });
        } else {
            await followUser({
                followerId: currentUser._id,
                followingId: user._id,
            });
        }
    };

    if (user === undefined) {
        return (
            <AppLayout>
                <div className="animate-pulse">
                    {/* Skeleton header */}
                    <header className="flex items-center gap-4 p-4 border-b border-[#262626] md:hidden">
                        <div className="w-6 h-6 skeleton rounded" />
                        <div className="w-32 h-6 skeleton rounded" />
                    </header>
                    {/* Skeleton profile */}
                    <div className="px-4 py-6">
                        <div className="flex items-center gap-6 md:gap-20">
                            <div className="w-20 h-20 md:w-36 md:h-36 rounded-full skeleton" />
                            <div className="flex-1 space-y-4">
                                <div className="w-40 h-6 skeleton rounded" />
                                <div className="flex gap-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-16 h-8 skeleton rounded" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!user) {
        return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <h2 className="text-xl font-semibold mb-2">User not found</h2>
                    <p className="text-[#a8a8a8]">
                        The user @{username} doesn't exist.
                    </p>
                    <Link href="/" className="btn-primary mt-4">
                        Go Home
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            {/* Mobile header */}
            <header className="sticky top-0 z-40 bg-black border-b border-[#262626] md:hidden">
                <div className="flex items-center justify-between h-11 px-4">
                    <button onClick={() => window.history.back()}>
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center gap-1">
                        <span className="font-semibold">{user.username}</span>
                        {user.isVerified && (
                            <BadgeCheck size={16} className="text-[#0095f6] fill-[#0095f6]" />
                        )}
                    </div>
                    {isOwnProfile ? (
                        <Link href="/settings">
                            <Settings size={24} />
                        </Link>
                    ) : (
                        <div className="w-6" />
                    )}
                </div>
            </header>

            {/* Profile section */}
            <div className="px-4 py-4 md:py-8 md:px-8 max-w-[935px] mx-auto">
                <div className="flex items-start gap-6 md:gap-20">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <Avatar
                            src={user.avatarUrl}
                            alt={user.username}
                            size="xl"
                            className="md:w-36 md:h-36"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        {/* Username row */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <h1 className="text-xl font-normal flex items-center gap-1">
                                {user.username}
                                {user.isVerified && (
                                    <BadgeCheck size={20} className="text-[#0095f6] fill-[#0095f6]" />
                                )}
                            </h1>
                            {isOwnProfile ? (
                                <Link href="/settings/profile" className="btn-secondary text-sm py-1.5">
                                    Edit profile
                                </Link>
                            ) : (
                                <button
                                    onClick={handleFollowToggle}
                                    className={
                                        isFollowing
                                            ? "btn-secondary text-sm py-1.5"
                                            : "btn-primary text-sm py-1.5"
                                    }
                                >
                                    {isFollowing ? "Following" : "Follow"}
                                </button>
                            )}
                        </div>

                        {/* Stats (desktop) */}
                        <div className="hidden md:flex gap-10 mb-4">
                            <span>
                                <strong>{user.postsCount}</strong> posts
                            </span>
                            <button className="hover:opacity-70">
                                <strong>{user.followersCount}</strong> followers
                            </button>
                            <button className="hover:opacity-70">
                                <strong>{user.followingCount}</strong> following
                            </button>
                        </div>

                        {/* Bio (desktop) */}
                        <div className="hidden md:block">
                            <h2 className="font-semibold">{user.displayName}</h2>
                            {user.bio && (
                                <p className="whitespace-pre-wrap text-sm mt-1">{user.bio}</p>
                            )}
                            {user.website && (
                                <a
                                    href={user.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-sm text-[#e0f1ff] font-medium mt-1 hover:underline"
                                >
                                    <LinkIcon size={12} />
                                    {user.website.replace(/^https?:\/\//, "")}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bio (mobile) */}
                <div className="md:hidden mt-4">
                    <h2 className="font-semibold">{user.displayName}</h2>
                    {user.bio && (
                        <p className="whitespace-pre-wrap text-sm mt-1">{user.bio}</p>
                    )}
                    {user.website && (
                        <a
                            href={user.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-[#e0f1ff] font-medium mt-1 hover:underline"
                        >
                            <LinkIcon size={12} />
                            {user.website.replace(/^https?:\/\//, "")}
                        </a>
                    )}
                </div>

                {/* Stats (mobile) */}
                <div className="flex justify-around py-3 mt-4 border-y border-[#262626] md:hidden">
                    <div className="flex flex-col items-center">
                        <span className="font-semibold">{user.postsCount}</span>
                        <span className="text-[#a8a8a8] text-sm">posts</span>
                    </div>
                    <button className="flex flex-col items-center">
                        <span className="font-semibold">{user.followersCount}</span>
                        <span className="text-[#a8a8a8] text-sm">followers</span>
                    </button>
                    <button className="flex flex-col items-center">
                        <span className="font-semibold">{user.followingCount}</span>
                        <span className="text-[#a8a8a8] text-sm">following</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-t border-[#262626]">
                <button
                    onClick={() => setActiveTab("posts")}
                    className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-t-2 ${activeTab === "posts"
                            ? "border-white"
                            : "border-transparent text-[#a8a8a8]"
                        }`}
                >
                    <Grid3X3 size={12} />
                    <span className="text-xs uppercase tracking-wider hidden md:inline">
                        Posts
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab("reels")}
                    className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-t-2 ${activeTab === "reels"
                            ? "border-white"
                            : "border-transparent text-[#a8a8a8]"
                        }`}
                >
                    <Film size={12} />
                    <span className="text-xs uppercase tracking-wider hidden md:inline">
                        Reels
                    </span>
                </button>
                {isOwnProfile && (
                    <button
                        onClick={() => setActiveTab("saved")}
                        className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-t-2 ${activeTab === "saved"
                                ? "border-white"
                                : "border-transparent text-[#a8a8a8]"
                            }`}
                    >
                        <Bookmark size={12} />
                        <span className="text-xs uppercase tracking-wider hidden md:inline">
                            Saved
                        </span>
                    </button>
                )}
            </div>

            {/* Posts grid */}
            <div className="post-grid">
                {userPosts === undefined ? (
                    Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="aspect-square skeleton" />
                    ))
                ) : userPosts.length === 0 ? (
                    <div className="col-span-3 flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center mb-4">
                            <Grid3X3 size={32} strokeWidth={1} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No Posts Yet</h3>
                        {isOwnProfile && (
                            <Link href="/create" className="text-[#0095f6] mt-2">
                                Create your first post
                            </Link>
                        )}
                    </div>
                ) : (
                    userPosts.map((post) => (
                        <Link
                            key={post._id}
                            href={`/p/${post._id}`}
                            className="relative aspect-square bg-[#1a1a1a] group"
                        >
                            <Image
                                src={post.imageUrl}
                                alt="Post"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 33vw, 200px"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                                <span className="flex items-center gap-1 font-semibold">
                                    ❤️ {post.likesCount}
                                </span>
                                <span className="flex items-center gap-1 font-semibold">
                                    💬 {post.commentsCount}
                                </span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </AppLayout>
    );
}
