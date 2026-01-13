"use client";

import { use, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AppLayout } from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/Avatar";
import {
    ArrowLeft,
    Heart,
    MessageCircle,
    Send,
    Bookmark,
    MoreHorizontal,
    BadgeCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Id } from "../../../../convex/_generated/dataModel";

interface PostPageProps {
    params: Promise<{ id: string }>;
}

export default function PostPage({ params }: PostPageProps) {
    const { id } = use(params);
    const postId = id as Id<"posts">;

    const [commentText, setCommentText] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    const post = useQuery(api.posts.getPost, { postId });
    const comments = useQuery(api.interactions.getComments, { postId });
    const currentUser = useQuery(api.users.getCurrentUser);

    const likePost = useMutation(api.interactions.likePost);
    const unlikePost = useMutation(api.interactions.unlikePost);
    const addComment = useMutation(api.interactions.addComment);
    const savePost = useMutation(api.interactions.savePost);
    const unsavePost = useMutation(api.interactions.unsavePost);

    // Initialize likes count when post loads
    if (post && likesCount === 0) {
        setLikesCount(post.likesCount);
    }

    const handleLikeToggle = async () => {
        if (!currentUser || !post) return;

        if (isLiked) {
            setIsLiked(false);
            setLikesCount((prev) => prev - 1);
            await unlikePost({ userId: currentUser._id, postId: post._id });
        } else {
            setIsLiked(true);
            setLikesCount((prev) => prev + 1);
            await likePost({ userId: currentUser._id, postId: post._id });
        }
    };

    const handleSaveToggle = async () => {
        if (!currentUser || !post) return;

        if (isSaved) {
            setIsSaved(false);
            await unsavePost({ userId: currentUser._id, postId: post._id });
        } else {
            setIsSaved(true);
            await savePost({ userId: currentUser._id, postId: post._id });
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !currentUser || !post) return;

        await addComment({
            authorId: currentUser._id,
            postId: post._id,
            text: commentText.trim(),
        });
        setCommentText("");
    };

    if (post === undefined) {
        return (
            <AppLayout>
                <div className="animate-pulse">
                    <header className="flex items-center h-11 px-4 border-b border-[#262626]">
                        <div className="w-6 h-6 skeleton rounded" />
                        <div className="w-20 h-5 skeleton rounded mx-auto" />
                    </header>
                    <div className="aspect-square skeleton" />
                    <div className="p-4 space-y-3">
                        <div className="w-32 h-4 skeleton rounded" />
                        <div className="w-full h-3 skeleton rounded" />
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!post) {
        return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <h2 className="text-xl font-semibold mb-2">Post not found</h2>
                    <p className="text-[#a8a8a8]">This post may have been deleted.</p>
                    <Link href="/" className="btn-primary mt-4">
                        Go Home
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            {/* Mobile layout */}
            <div className="md:hidden">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-black border-b border-[#262626]">
                    <div className="flex items-center justify-between h-11 px-4">
                        <button onClick={() => window.history.back()}>
                            <ArrowLeft size={24} />
                        </button>
                        <span className="font-semibold">Post</span>
                        <div className="w-6" />
                    </div>
                </header>

                {/* Post header */}
                <div className="flex items-center justify-between px-3 py-3">
                    <div className="flex items-center gap-3">
                        <Avatar
                            src={post.author?.avatarUrl}
                            alt={post.author?.username}
                            size="sm"
                        />
                        <Link
                            href={`/profile/${post.author?.username}`}
                            className="font-semibold text-sm flex items-center gap-1"
                        >
                            {post.author?.username}
                            {post.author?.isVerified && (
                                <BadgeCheck size={14} className="text-[#0095f6] fill-[#0095f6]" />
                            )}
                        </Link>
                    </div>
                    <button className="p-2">
                        <MoreHorizontal size={20} />
                    </button>
                </div>

                {/* Image */}
                <div className="relative aspect-square bg-[#1a1a1a]">
                    <Image
                        src={post.imageUrl}
                        alt={post.caption || "Post"}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Actions */}
                <div className="px-3 pt-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={handleLikeToggle}>
                                <Heart
                                    size={24}
                                    className={isLiked ? "text-[#ed4956] fill-[#ed4956]" : ""}
                                    strokeWidth={isLiked ? 0 : 1.5}
                                />
                            </button>
                            <button>
                                <MessageCircle size={24} strokeWidth={1.5} />
                            </button>
                            <button>
                                <Send size={24} strokeWidth={1.5} />
                            </button>
                        </div>
                        <button onClick={handleSaveToggle}>
                            <Bookmark
                                size={24}
                                className={isSaved ? "fill-white" : ""}
                                strokeWidth={1.5}
                            />
                        </button>
                    </div>

                    <button className="font-semibold text-sm mt-3">
                        {likesCount.toLocaleString()} likes
                    </button>

                    {post.caption && (
                        <p className="text-sm mt-2">
                            <Link
                                href={`/profile/${post.author?.username}`}
                                className="font-semibold mr-1"
                            >
                                {post.author?.username}
                            </Link>
                            {post.caption}
                        </p>
                    )}

                    <time className="text-[10px] text-[#a8a8a8] uppercase mt-2 block">
                        {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                    </time>
                </div>

                {/* Comments */}
                <div className="px-3 py-4 space-y-4">
                    {comments?.map((comment) => (
                        <div key={comment._id} className="flex gap-3">
                            <Avatar
                                src={comment.author?.avatarUrl}
                                alt={comment.author?.username}
                                size="sm"
                            />
                            <div className="flex-1">
                                <p className="text-sm">
                                    <Link
                                        href={`/profile/${comment.author?.username}`}
                                        className="font-semibold mr-1"
                                    >
                                        {comment.author?.username}
                                    </Link>
                                    {comment.text}
                                </p>
                                <time className="text-xs text-[#a8a8a8]">
                                    {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                                </time>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comment input (fixed) */}
                <form
                    onSubmit={handleSubmitComment}
                    className="fixed bottom-12 left-0 right-0 border-t border-[#262626] bg-black px-4 py-3 md:bottom-0"
                >
                    <div className="flex items-center gap-3">
                        <Avatar src={currentUser?.avatarUrl} size="sm" />
                        <input
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-[#a8a8a8]"
                        />
                        {commentText.trim() && (
                            <button type="submit" className="text-[#0095f6] font-semibold text-sm">
                                Post
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Desktop layout */}
            <div className="hidden md:flex max-w-[935px] mx-auto my-8 border border-[#262626] rounded-sm overflow-hidden">
                {/* Image */}
                <div className="relative w-[600px] aspect-square bg-[#1a1a1a]">
                    <Image
                        src={post.imageUrl}
                        alt={post.caption || "Post"}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Details */}
                <div className="flex flex-col w-[335px] border-l border-[#262626]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626]">
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={post.author?.avatarUrl}
                                alt={post.author?.username}
                                size="sm"
                            />
                            <Link
                                href={`/profile/${post.author?.username}`}
                                className="font-semibold text-sm flex items-center gap-1"
                            >
                                {post.author?.username}
                                {post.author?.isVerified && (
                                    <BadgeCheck size={14} className="text-[#0095f6] fill-[#0095f6]" />
                                )}
                            </Link>
                        </div>
                        <button>
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    {/* Comments scroll area */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                        {/* Caption as first comment */}
                        {post.caption && (
                            <div className="flex gap-3">
                                <Avatar
                                    src={post.author?.avatarUrl}
                                    alt={post.author?.username}
                                    size="sm"
                                />
                                <div>
                                    <p className="text-sm">
                                        <Link
                                            href={`/profile/${post.author?.username}`}
                                            className="font-semibold mr-1"
                                        >
                                            {post.author?.username}
                                        </Link>
                                        {post.caption}
                                    </p>
                                    <time className="text-xs text-[#a8a8a8]">
                                        {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                                    </time>
                                </div>
                            </div>
                        )}

                        {/* Comments */}
                        {comments?.map((comment) => (
                            <div key={comment._id} className="flex gap-3">
                                <Avatar
                                    src={comment.author?.avatarUrl}
                                    alt={comment.author?.username}
                                    size="sm"
                                />
                                <div className="flex-1">
                                    <p className="text-sm">
                                        <Link
                                            href={`/profile/${comment.author?.username}`}
                                            className="font-semibold mr-1"
                                        >
                                            {comment.author?.username}
                                        </Link>
                                        {comment.text}
                                    </p>
                                    <time className="text-xs text-[#a8a8a8]">
                                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                                    </time>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="border-t border-[#262626] px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button onClick={handleLikeToggle}>
                                    <Heart
                                        size={24}
                                        className={isLiked ? "text-[#ed4956] fill-[#ed4956]" : ""}
                                        strokeWidth={isLiked ? 0 : 1.5}
                                    />
                                </button>
                                <button>
                                    <MessageCircle size={24} strokeWidth={1.5} />
                                </button>
                                <button>
                                    <Send size={24} strokeWidth={1.5} />
                                </button>
                            </div>
                            <button onClick={handleSaveToggle}>
                                <Bookmark
                                    size={24}
                                    className={isSaved ? "fill-white" : ""}
                                    strokeWidth={1.5}
                                />
                            </button>
                        </div>

                        <button className="font-semibold text-sm mt-2">
                            {likesCount.toLocaleString()} likes
                        </button>

                        <time className="text-[10px] text-[#a8a8a8] uppercase block mt-1">
                            {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                        </time>
                    </div>

                    {/* Comment input */}
                    <form
                        onSubmit={handleSubmitComment}
                        className="border-t border-[#262626] px-4 py-3"
                    >
                        <div className="flex items-center gap-3">
                            <input
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-[#a8a8a8]"
                            />
                            {commentText.trim() && (
                                <button type="submit" className="text-[#0095f6] font-semibold text-sm">
                                    Post
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
