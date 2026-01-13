"use client";

import { useRef } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Id } from "../../../convex/_generated/dataModel";

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

    return (
        <div className="border-b border-[#262626] bg-black">
            <div
                ref={scrollRef}
                className="flex gap-4 px-4 py-4 overflow-x-auto hide-scrollbar"
            >
                {/* Your Story (Create) */}
                <button
                    onClick={onCreateStory}
                    className="flex flex-col items-center gap-1 flex-shrink-0"
                >
                    <div className="relative">
                        <Avatar src={undefined} alt="Your story" size="lg" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#0095f6] rounded-full flex items-center justify-center border-2 border-black">
                            <Plus size={14} strokeWidth={3} />
                        </div>
                    </div>
                    <span className="text-xs text-[#f5f5f5] max-w-[66px] truncate">
                        Your story
                    </span>
                </button>

                {/* Other users' stories */}
                {storyGroups.map((group) => (
                    <Link
                        key={group.author._id}
                        href={`/stories/${group.author.username}`}
                        className="flex flex-col items-center gap-1 flex-shrink-0"
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
                            size="lg"
                            hasStory
                            storyViewed={false}
                        />
                        <span className="text-xs text-[#f5f5f5] max-w-[66px] truncate">
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
                    <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="w-14 h-14 rounded-full skeleton" />
                        <div className="w-12 h-2 skeleton" />
                    </div>
                ))}
            </div>
        </div>
    );
}
