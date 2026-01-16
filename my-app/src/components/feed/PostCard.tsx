"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Id } from "../../../convex/_generated/dataModel";

interface Post {
    _id: Id<"posts">;
    author: {
        _id: Id<"users">;
        username: string;
        displayName: string;
        avatarUrl?: string;
    };
    imageUrl: string;
    caption?: string;
    location?: string;
    likesCount: number;
    commentsCount: number;
    createdAt: number;
}

export function PostCard({ post }: { post: Post; currentUserId?: Id<"users"> }) {
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
        <article className="bg-white mb-2">
            {/* Header */}
            <header className="flex items-center justify-between px-3 py-3">
                <Link href={`/profile/${post.author.username}`} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        {post.author.avatarUrl ? (
                            <img
                                src={post.author.avatarUrl}
                                alt={post.author.username}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-300" />
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-sm">{post.author.username}</p>
                        {post.location && (
                            <p className="text-xs text-[#8E8E8E]">{post.location}</p>
                        )}
                    </div>
                </Link>
                <button className="p-2">
                    <MoreHorizontal size={20} />
                </button>
            </header>

            {/* Image - FIXED: Smaller, proper aspect ratio */}
            <div
                className="relative w-full aspect-square bg-gray-100 cursor-pointer"
                onDoubleClick={handleDoubleTap}
            >
                <Image
                    src={post.imageUrl}
                    alt={post.caption || "Post"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 470px"
                    priority={false}
                />

                {showHeartAnimation && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <Heart
                            size={80}
                            className="text-white fill-white animate-heart-pop"
                            strokeWidth={0}
                            style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.5))" }}
                        />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="px-3">
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-4">
                        <button onClick={handleLikeToggle} className="hover:opacity-50">
                            <Heart
                                size={24}
                                className={isLiked ? "text-[#ED4956] fill-[#ED4956]" : ""}
                                strokeWidth={2}
                            />
                        </button>
                        <Link href={`/p/${post._id}`} className="hover:opacity-50">
                            <MessageCircle size={24} strokeWidth={2} />
                        </Link>
                        <button className="hover:opacity-50">
                            <Send size={24} strokeWidth={2} />
                        </button>
                    </div>
                    <button onClick={() => setIsSaved(!isSaved)} className="hover:opacity-50">
                        <Bookmark
                            size={24}
                            className={isSaved ? "fill-current" : ""}
                            strokeWidth={2}
                        />
                    </button>
                </div>

                {/* Likes */}
                <button className="font-semibold text-sm mb-1">
                    {likesCount.toLocaleString()} likes
                </button>

                {/* Caption */}
                {post.caption && (
                    <div className="text-sm mb-1">
                        <Link href={`/profile/${post.author.username}`} className="font-semibold">
                            {post.author.username}
                        </Link>
                        {" "}
                        <span>{post.caption}</span>
                    </div>
                )}

                {/* Comments */}
                {post.commentsCount > 0 && (
                    <Link
                        href={`/p/${post._id}`}
                        className="text-sm text-[#8E8E8E] mb-1 block"
                    >
                        View all {post.commentsCount} comments
                    </Link>
                )}

                {/* Time */}
                <time className="text-xs text-[#8E8E8E] uppercase block mb-2">
                    {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                </time>
            </div>

            {/* Add Comment */}
            <div className="flex items-center gap-2 px-3 py-2 border-t border-[#EFEFEF]">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-[#8E8E8E]"
                />
                {comment.trim() && (
                    <button
                        onClick={() => setComment("")}
                        className="text-[#0095F6] font-semibold text-sm hover:text-[#00376b]"
                    >
                        Post
                    </button>
                )}
            </div>
        </article>
    );
}

export function PostCardSkeleton() {
    return (
        <article className="bg-white mb-2">
            <header className="flex items-center gap-3 px-3 py-3">
                <div className="w-8 h-8 rounded-full skeleton" />
                <div className="flex-1">
                    <div className="w-24 h-3 skeleton mb-2" />
                    <div className="w-16 h-2 skeleton" />
                </div>
            </header>
            <div className="w-full aspect-square skeleton" />
            <div className="px-3 py-2">
                <div className="w-20 h-3 skeleton mb-2" />
                <div className="w-full h-3 skeleton mb-2" />
                <div className="w-32 h-2 skeleton" />
            </div>
        </article>
    );
}
