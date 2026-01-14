"use client";

import { useRef } from "react";
import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
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

    const canScrollLeft = scrollRef.current && scrollRef.current.scrollLeft > 0;
    const canScrollRight = scrollRef.current &&
        scrollRef.current.scrollLeft < (scrollRef.current.scrollWidth - scrollRef.current.clientWidth);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative bg-white dark:bg-black border border-[#DBDBDB] dark:border-[#262626] rounded-lg p-4 mb-6">
            {/* Scroll Left Button */}
            {canScrollLeft && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white dark:bg-[#262626] shadow-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#363636]"
                >
                    <ChevronRight size={16} className="rotate-180" />
                </button>
            )}

            {/* Stories Container */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto hide-scrollbar"
                onScroll={() => { }}
            >
                {/* Your Story */}
                <button
                    onClick={onCreateStory}
                    className="flex flex-col items-center gap-1 flex-shrink-0 group"
                >
                    <div className="relative">
                        <div className="w-[66px] h-[66px] rounded-full border-2 border-[#DBDBDB] dark:border-[#262626] overflow-hidden bg-[#FAFAFA] dark:bg-[#121212] flex items-center justify-center">
                            {currentUser?.avatarUrl ? (
                                <img
                                    src={currentUser.avatarUrl}
                                    alt="Your story"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full" />
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#0095F6] rounded-full border-2 border-white dark:border-black flex items-center justify-center">
                            <Plus size={12} strokeWidth={3} className="text-white" />
                        </div>
                    </div>
                    <span className="text-xs text-center max-w-[74px] truncate">
                        Your story
                    </span>
                </button>

                {/* Other Users' Stories */}
                {storyGroups.map((group, index) => (
                    <button
                        key={group.author._id}
                        className="flex flex-col items-center gap-1 flex-shrink-0 group"
                        onClick={() => onStoryClick?.(group.author._id, 0)}
                    >
                        <div className="story-ring">
                            <div className="story-ring-inner">
                                <div className="w-[62px] h-[62px] rounded-full overflow-hidden">
                                    {group.author.avatarUrl ? (
                                        <img
                                            src={group.author.avatarUrl}
                                            alt={group.author.username}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-300 dark:bg-gray-700" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <span className="text-xs text-center max-w-[74px] truncate text-[#262626] dark:text-white">
                            {group.author.username}
                        </span>
                    </button>
                ))}
            </div>

            {/* Scroll Right Button */}
            {canScrollRight && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white dark:bg-[#262626] shadow-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#363636]"
                >
                    <ChevronRight size={16} />
                </button>
            )}
        </div>
    );
}

export function StoriesBarSkeleton() {
    return (
        <div className="bg-white dark:bg-black border border-[#DBDBDB] dark:border-[#262626] rounded-lg p-4 mb-6">
            <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="w-[66px] h-[66px] rounded-full skeleton" />
                        <div className="w-14 h-3 skeleton" />
                    </div>
                ))}
            </div>
        </div>
    );
}
