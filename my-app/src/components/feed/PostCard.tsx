"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { formatDistanceToNow } from "date-fns";
import { Id } from "../../../convex/_generated/dataModel";

interface Post {
    _id: Id<"posts">;
    author: {
        _id: Id<"users">;
        username: string;
        displayName: string;
        avatarUrl?: string;
        isVerified?: boolean;
    };
    imageUrl: string;
    caption?: string;
    location?: string;
    likesCount: number;
    commentsCount: number;
    createdAt: number;
}

interface PostCardProps {
    post: Post;
    currentUserId?: Id<"users">;
}

export function PostCard({ post, currentUserId }: PostCardProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likesCount);
    const [showHeartAnimation, setShowHeartAnimation] = useState(false);
    const [comment, setComment] = useState("");

    const handleLikeToggle = () => {
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    };

    const handleDoubleTap = () => {
        if (!isLiked) {
            setIsLiked(true);
            setLikesCount(likesCount + 1);
            setShowHeartAnimation(true);
            setTimeout(() => setShowHeartAnimation(false), 800);
        }
    };

    return (
        <article className="bg-white dark:bg-black border border-[#DBDBDB] dark:border-[#262626] rounded-lg mb-4">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <Link href={`/profile/${post.author.username}`}>
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-[#DBDBDB] dark:border-[#262626]">
                            {post.author.avatarUrl ? (
                                <img
                                    src={post.author.avatarUrl}
                                    alt={post.author.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-300 dark:bg-gray-700" />
                            )}
                        </div>
                    </Link>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <Link
                                href={`/profile/${post.author.username}`}
                                className="font-semibold text-sm hover:opacity-50"
                            >
                                {post.author.username}
                            </Link>
                            {post.location && (
                                <>
                                    <span className="text-[#737373] text-sm">•</span>
                                    <span className="text-[#737373] text-sm">{post.location}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <button className="p-2 hover:opacity-50">
                    <MoreHorizontal size={24} />
                </button>
            </header>

            {/* Image */}
            <div
                className="relative aspect-square bg-[#F5F5F5] dark:bg-[#0a0a0a] cursor-pointer select-none"
                onDoubleClick={handleDoubleTap}
            >
                <Image
                    src={post.imageUrl}
                    alt={post.caption || "Post image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 630px"
                    priority
                />

                {/* Heart animation */}
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
            <div className="px-4">
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLikeToggle}
                            className="hover:opacity-50 transition-opacity"
                        >
                            <Heart
                                size={24}
                                className={isLiked ? "text-[#ED4956] fill-[#ED4956]" : ""}
                                strokeWidth={1.5}
                            />
                        </button>
                        <Link href={`/p/${post._id}`} className="hover:opacity-50 transition-opacity">
                            <MessageCircle size={24} strokeWidth={1.5} />
                        </Link>
                        <button className="hover:opacity-50 transition-opacity">
                            <Send size={24} strokeWidth={1.5} />
                        </button>
                    </div>
                    <button
                        onClick={() => setIsSaved(!isSaved)}
                        className="hover:opacity-50 transition-opacity"
                    >
                        <Bookmark
                            size={24}
                            className={isSaved ? "fill-current" : ""}
                            strokeWidth={1.5}
                        />
                    </button>
                </div>

                {/* Likes */}
                <button className="font-semibold text-sm mb-2 hover:opacity-50">
                    {likesCount.toLocaleString()} likes
                </button>

                {/* Caption */}
                {post.caption && (
                    <div className="text-sm mb-2">
                        <Link
                            href={`/profile/${post.author.username}`}
                            className="font-semibold mr-2 hover:opacity-50"
                        >
                            {post.author.username}
                        </Link>
                        <span>{post.caption}</span>
                    </div>
                )}

                {/* View Comments */}
                {post.commentsCount > 0 && (
                    <Link
                        href={`/p/${post._id}`}
                        className="text-sm text-[#737373] mb-2 block hover:opacity-50"
                    >
                        View all {post.commentsCount} comments
                    </Link>
                )}

                {/* Time */}
                <time className="text-xs text-[#737373] block mb-3">
                    {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                </time>

                {/* Add Comment */}
                <div className="flex items-center gap-2 pt-2 pb-3 border-t border-[#EFEFEF] dark:border-[#262626]">
                    <button className="hover:opacity-50">
                        <Smile size={20} className="text-[#262626] dark:text-white" />
                    </button>
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-[#737373]"
                    />
                    {comment && (
                        <button className="text-[#0095F6] font-semibold text-sm hover:opacity-50">
                            Post
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}

export function PostCardSkeleton() {
    return (
        <article className="bg-white dark:bg-black border border-[#DBDBDB] dark:border-[#262626] rounded-lg mb-4">
            <header className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-full skeleton" />
                <div className="flex-1">
                    <div className="w-24 h-3 skeleton mb-2" />
                    <div className="w-16 h-2 skeleton" />
                </div>
            </header>
            <div className="aspect-square skeleton" />
            <div className="px-4 py-3">
                <div className="w-20 h-3 skeleton mb-2" />
                <div className="w-full h-3 skeleton mb-2" />
                <div className="w-32 h-2 skeleton" />
            </div>
        </article>
    );
}
