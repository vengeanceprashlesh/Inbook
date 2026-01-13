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
            } else if (!isLiked) {
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
        <article className="border-b border-[#262626] animate-fade-in">
            {/* Header */}
            <header className="flex items-center justify-between px-3 py-3">
                <div className="flex items-center gap-3">
                    <Avatar
                        src={post.author?.avatarUrl}
                        alt={post.author?.username}
                        size="sm"
                        hasStory={false}
                    />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <Link
                                href={`/profile/${post.author?.username}`}
                                className="font-semibold text-sm hover:opacity-70"
                            >
                                {post.author?.username}
                            </Link>
                            {post.author?.isVerified && (
                                <BadgeCheck size={14} className="text-[#0095f6] fill-[#0095f6]" />
                            )}
                        </div>
                        {post.location && (
                            <span className="text-xs text-[#a8a8a8]">{post.location}</span>
                        )}
                    </div>
                </div>
                <button className="p-2 hover:opacity-70">
                    <MoreHorizontal size={20} />
                </button>
            </header>

            {/* Image */}
            <div
                className="relative aspect-square bg-[#1a1a1a] double-tap-area"
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
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Heart
                            size={80}
                            className="text-white fill-white animate-heart-pop drop-shadow-lg"
                        />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="px-3 pt-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLikeToggle}
                            className="hover:opacity-70 transition-transform active:scale-90"
                        >
                            <Heart
                                size={24}
                                className={isLiked ? "text-[#ed4956] fill-[#ed4956]" : ""}
                                strokeWidth={isLiked ? 0 : 1.5}
                            />
                        </button>
                        <Link href={`/p/${post._id}`} className="hover:opacity-70">
                            <MessageCircle size={24} strokeWidth={1.5} />
                        </Link>
                        <button className="hover:opacity-70">
                            <Send size={24} strokeWidth={1.5} />
                        </button>
                    </div>
                    <button
                        onClick={handleSaveToggle}
                        className="hover:opacity-70 transition-transform active:scale-90"
                    >
                        <Bookmark
                            size={24}
                            className={isSaved ? "fill-white" : ""}
                            strokeWidth={1.5}
                        />
                    </button>
                </div>

                {/* Likes count */}
                <button className="font-semibold text-sm mt-3 hover:opacity-70">
                    {likesCount.toLocaleString()} likes
                </button>

                {/* Caption */}
                {post.caption && (
                    <p className="text-sm mt-2">
                        <Link
                            href={`/profile/${post.author?.username}`}
                            className="font-semibold mr-1 hover:opacity-70"
                        >
                            {post.author?.username}
                        </Link>
                        <span className="text-[#f5f5f5]">{post.caption}</span>
                    </p>
                )}

                {/* Comments link */}
                {post.commentsCount > 0 && (
                    <Link
                        href={`/p/${post._id}`}
                        className="text-sm text-[#a8a8a8] mt-1 block hover:opacity-70"
                    >
                        View all {post.commentsCount} comments
                    </Link>
                )}

                {/* Time */}
                <time className="text-[10px] text-[#a8a8a8] uppercase mt-2 block mb-3">
                    {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                </time>
            </div>
        </article>
    );
}

// Skeleton loader for posts
export function PostCardSkeleton() {
    return (
        <article className="border-b border-[#262626]">
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
