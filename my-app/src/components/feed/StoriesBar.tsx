"use client";

import { useRef } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
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
        <div className="bg-white border border-[#DBDBDB] rounded-lg p-4 mb-6">
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto hide-scrollbar"
            >
                {/* Your Story */}
                <button
                    onClick={onCreateStory}
                    className="flex flex-col items-center gap-2 flex-shrink-0"
                >
                    <div className="relative">
                        <div className="w-[66px] h-[66px] rounded-full border-2 border-[#DBDBDB] overflow-hidden bg-[#FAFAFA] flex items-center justify-center">
                            {currentUser?.avatarUrl ? (
                                <img
                                    src={currentUser.avatarUrl}
                                    alt="Your story"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 bg-gray-300 rounded-full" />
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#0095F6] rounded-full border-2 border-white flex items-center justify-center">
                            <Plus size={14} strokeWidth={3} className="text-white" />
                        </div>
                    </div>
                    <span className="text-xs text-[#262626] max-w-[74px] truncate">
                        Your story
                    </span>
                </button>

                {/* Other Stories */}
                {storyGroups.map((group) => (
                    <button
                        key={group.author._id}
                        className="flex flex-col items-center gap-2 flex-shrink-0"
                        onClick={() => onStoryClick?.(group.author._id, 0)}
                    >
                        <div className="story-gradient">
                            <div className="story-inner">
                                <div className="w-[62px] h-[62px] rounded-full overflow-hidden">
                                    {group.author.avatarUrl ? (
                                        <img
                                            src={group.author.avatarUrl}
                                            alt={group.author.username}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-300" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <span className="text-xs text-[#262626] max-w-[74px] truncate">
                            {group.author.username}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export function StoriesBarSkeleton() {
    return (
        <div className="bg-white border border-[#DBDBDB] rounded-lg p-4 mb-6">
            <div className="flex gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
                        <div className="w-[66px] h-[66px] rounded-full skeleton" />
                        <div className="w-14 h-3 skeleton" />
                    </div>
                ))}
            </div>
        </div>
    );
}
