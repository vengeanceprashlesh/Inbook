"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
    Heart,
    MessageCircle,
    Send,
    Bookmark,
    MoreHorizontal,
    BadgeCheck,
} from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface PostCardProps {
    post: {
        _id: Id<"posts">;
        imageUrl: string;
        caption?: string;
        location?: string;
        likesCount: number;
        commentsCount: number;
        createdAt: number;
        author?: {
            _id: Id<"users">;
            username: string;
            displayName: string;
            avatarUrl?: string;
            isVerified?: boolean;
        } | null;
    };
    currentUserId?: Id<"users">;
    isLiked?: boolean;
    isSaved?: boolean;
}

export function PostCard({
    post,
    currentUserId,
    isLiked: initialLiked = false,
    isSaved: initialSaved = false,
}: PostCardProps) {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [likesCount, setLikesCount] = useState(post.likesCount);
    const [showHeartAnimation, setShowHeartAnimation] = useState(false);
    const lastTapRef = useRef(0);

    const likePost = useMutation(api.interactions.likePost);
    const unlikePost = useMutation(api.interactions.unlikePost);
    const savePost = useMutation(api.interactions.savePost);
    const unsavePost = useMutation(api.interactions.unsavePost);

    const handleDoubleTap = async () => {
        const now = Date.now();
        if (now - lastTapRef.current < 300) {
            // Double tap detected
            if (!isLiked && currentUserId) {
                setIsLiked(true);
                setLikesCount((prev) => prev + 1);
                setShowHeartAnimation(true);
                setTimeout(() => setShowHeartAnimation(false), 1000);
                await likePost({ userId: currentUserId, postId: post._id });
            } else {
                setShowHeartAnimation(true);
                setTimeout(() => setShowHeartAnimation(false), 1000);
            }
        }
        lastTapRef.current = now;
    };

    const handleLikeToggle = async () => {
        if (!currentUserId) return;

        if (isLiked) {
            setIsLiked(false);
            setLikesCount((prev) => prev - 1);
            await unlikePost({ userId: currentUserId, postId: post._id });
        } else {
            setIsLiked(true);
            setLikesCount((prev) => prev + 1);
            await likePost({ userId: currentUserId, postId: post._id });
        }
    };

    const handleSaveToggle = async () => {
        if (!currentUserId) return;

        if (isSaved) {
            setIsSaved(false);
            await unsavePost({ userId: currentUserId, postId: post._id });
        } else {
            setIsSaved(true);
            await savePost({ userId: currentUserId, postId: post._id });
        }
    };

    return (
        <article className="border-b border-[#262626] animate-fade-in pb-4 md:pb-5">
            {/* Header */}
            <header className="flex items-center justify-between px-3 py-3">
                <div className="flex items-center gap-3">
                    <div className="p-[2px] rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
                        <div className="bg-black p-[2px] rounded-full">
                            <Avatar
                                src={post.author?.avatarUrl}
                                alt={post.author?.username}
                                size="sm"
                                hasStory={false}
                                className="w-8 h-8"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col -gap-0.5">
                        <div className="flex items-center gap-1 group">
                            <Link
                                href={`/profile/${post.author?.username}`}
                                className="font-semibold text-sm hover:opacity-70 transition-opacity flex items-center gap-1"
                            >
                                {post.author?.username}
                                {post.author?.isVerified && (
                                    <BadgeCheck size={12} className="text-[#0095f6] fill-[#0095f6]" />
                                )}
                            </Link>
                            <span className="text-[var(--muted)] text-xs">• {formatDistanceToNow(post.createdAt, { addSuffix: false }).replace("about ", "").replace(" hours", "h").replace(" hour", "h").replace(" minutes", "m").replace(" minute", "m")}</span>
                        </div>
                        {post.location && (
                            <span className="text-xs text-[var(--muted)] -mt-0.5">{post.location}</span>
                        )}
                    </div>
                </div>
                <button className="p-2 hover:opacity-50 transition-opacity">
                    <MoreHorizontal size={20} />
                </button>
            </header>

            {/* Image (Aspect Ratio 4:5 for standard IG look) */}
            <div
                className="relative aspect-[4/5] bg-[#1a1a1a] double-tap-area overflow-hidden rounded-[4px] border border-[#262626]"
                onClick={handleDoubleTap}
            >
                <Image
                    src={post.imageUrl}
                    alt={post.caption || "Post image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 470px"
                    priority
                />

                {/* Heart animation overlay */}
                {showHeartAnimation && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <Heart
                            size={100}
                            className="text-white fill-white animate-heart-pop"
                            strokeWidth={0}
                            style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.5))" }}
                        />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="px-3 pt-3">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLikeToggle}
                            className="hover:opacity-60 transition-all active:scale-90"
                        >
                            <Heart
                                size={24}
                                className={isLiked ? "text-[#ff3040] fill-[#ff3040]" : "text-white"}
                                strokeWidth={isLiked ? 0 : 2}
                            />
                        </button>
                        <Link href={`/p/${post._id}`} className="hover:opacity-60 transition-opacity">
                            <MessageCircle size={24} strokeWidth={2} className="text-white -rotate-90" style={{ transform: "scaleX(-1)" }} />
                        </Link>
                        <button className="hover:opacity-60 transition-opacity">
                            <Send size={24} strokeWidth={2} className="text-white" />
                        </button>
                    </div>
                    <button
                        onClick={handleSaveToggle}
                        className="hover:opacity-60 transition-all active:scale-90"
                    >
                        <Bookmark
                            size={24}
                            className={isSaved ? "fill-white text-white" : "text-white"}
                            strokeWidth={2}
                        />
                    </button>
                </div>

                {/* Likes count */}
                <div className="font-semibold text-sm mb-2">
                    {likesCount.toLocaleString()} likes
                </div>

                {/* Caption */}
                {post.caption && (
                    <div className="text-sm mb-2 leading-snug">
                        <Link
                            href={`/profile/${post.author?.username}`}
                            className="font-semibold mr-2 hover:opacity-70 transition-opacity"
                        >
                            {post.author?.username}
                        </Link>
                        <span className="text-[#f5f5f5]">{post.caption}</span>
                    </div>
                )}

                {/* Comments link */}
                <div className="mb-2">
                    <Link
                        href={`/p/${post._id}`}
                        className="text-sm text-[var(--muted)] cursor-pointer hover:text-[#a8a8a8] transition-colors"
                    >
                        View all {post.commentsCount} comments
                    </Link>
                </div>

                {/* Add Comment Input */}
                <div className="flex items-center justify-between border-b border-transparent focus-within:border-[#262626] pb-2">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        className="bg-transparent text-sm w-full focus:outline-none placeholder:text-[var(--muted)]"
                    />
                    <button className="text-[#0095f6] text-sm font-semibold opacity-0 focus-within:opacity-100 hover:text-white transition-all transform scale-90 focus-within:scale-100">
                        Post
                    </button>
                </div>
            </div>
        </article>
    );
}

// Skeleton loader for posts
export function PostCardSkeleton() {
    return (
        <article className="border-b border-[#262626] pb-4">
            <header className="flex items-center gap-3 px-3 py-3">
                <div className="w-8 h-8 rounded-full skeleton" />
                <div className="flex flex-col gap-1">
                    <div className="w-24 h-3 skeleton" />
                    <div className="w-16 h-2 skeleton" />
                </div>
            </header>
            <div className="aspect-square skeleton" />
            <div className="px-3 py-3 space-y-2">
                <div className="w-20 h-4 skeleton" />
                <div className="w-full h-3 skeleton" />
                <div className="w-24 h-2 skeleton" />
            </div>
        </article>
    );
}
