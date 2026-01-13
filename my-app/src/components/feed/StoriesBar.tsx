"use client";

import { useRef } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Id } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface StoryAuthor {
    _id: Id<"users">;
    username: string;
    displayName: string;
    avatarUrl?: string;
}

interface StoryGroup {
    author: StoryAuthor;
    stories: Array<{
        _id: Id<"stories">;
        imageUrl: string;
        createdAt: number;
    }>;
}

interface StoriesBarProps {
    storyGroups: StoryGroup[];
    currentUserId?: Id<"users">;
    onStoryClick?: (authorId: Id<"users">, storyIndex: number) => void;
    onCreateStory?: () => void;
}

export function StoriesBar({
    storyGroups,
    currentUserId,
    onStoryClick,
    onCreateStory,
}: StoriesBarProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const currentUser = useQuery(api.users.getCurrentUser);

    return (
        <div className="border-b border-[#262626] bg-black">
            <div
                ref={scrollRef}
                className="flex gap-4 px-4 py-4 overflow-x-auto hide-scrollbar"
            >
                {/* Your Story (Create) */}
                <button
                    onClick={onCreateStory}
                    className="flex flex-col items-center gap-1 flex-shrink-0 animate-scale-in group"
                    style={{ animationDelay: "0ms" }}
                >
                    <div className="relative p-[3px]">
                        <Avatar
                            src={currentUser?.avatarUrl}
                            alt="Your story"
                            size="xl"
                            className="bg-[#262626]"
                        />
                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#0095f6] rounded-full flex items-center justify-center border-[2.5px] border-black transition-transform group-hover:scale-110">
                            <Plus size={14} strokeWidth={3} className="text-white" />
                        </div>
                    </div>
                    <span className="text-xs text-[#f5f5f5] max-w-[74px] truncate leading-tight">
                        Your story
                    </span>
                </button>

                {/* Other users' stories */}
                {storyGroups.map((group, index) => (
                    <Link
                        key={group.author._id}
                        href={`/stories/${group.author.username}`}
                        className="flex flex-col items-center gap-1 flex-shrink-0 animate-scale-in active:opacity-70 transition-opacity"
                        style={{ animationDelay: `${(index + 1) * 50}ms` }}
                        onClick={(e) => {
                            if (onStoryClick) {
                                e.preventDefault();
                                onStoryClick(group.author._id, 0);
                            }
                        }}
                    >
                        <Avatar
                            src={group.author.avatarUrl}
                            alt={group.author.username}
                            size="xl"
                            hasStory
                            storyViewed={false}
                        />
                        <span className="text-xs text-[#f5f5f5] max-w-[74px] truncate leading-tight">
                            {group.author.username}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

// Skeleton loader
export function StoriesBarSkeleton() {
    return (
        <div className="border-b border-[#262626] bg-black">
            <div className="flex gap-4 px-4 py-4 overflow-x-auto hide-scrollbar">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                        <div className="w-[74px] h-[74px] rounded-full skeleton" />
                        <div className="w-16 h-2 skeleton" />
                    </div>
                ))}
            </div>
        </div>
    );
}
