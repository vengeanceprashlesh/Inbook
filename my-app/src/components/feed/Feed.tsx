"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { PostCard, PostCardSkeleton } from "./PostCard";
import { StoriesBar, StoriesBarSkeleton } from "./StoriesBar";
import { Id } from "../../../convex/_generated/dataModel";

interface FeedProps {
    currentUserId?: Id<"users">;
}

export function Feed({ currentUserId }: FeedProps) {
    const posts = useQuery(api.posts.getFeed, { limit: 20 });
    const stories = useQuery(api.stories.getActiveStories);

    const isLoading = posts === undefined || stories === undefined;

    if (isLoading) {
        return (
            <div className="container-app">
                <StoriesBarSkeleton />
                <div>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <PostCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container-app">
            {/* Stories */}
            <StoriesBar
                storyGroups={stories}
                currentUserId={currentUserId}
                onCreateStory={() => {
                    // Navigate to create story
                    window.location.href = "/create?type=story";
                }}
            />

            {/* Posts feed */}
            <div>
                {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <div className="relative mb-4">
                            <div className="w-[60px] h-[60px] rounded-full border-2 border-white flex items-center justify-center opacity-80">
                                <span className="text-3xl">📷</span>
                            </div>
                            <div className="absolute -top-1 -right-1 text-xl">✨</div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">No posts yet</h3>
                        <p className="text-[#a8a8a8] text-sm max-w-xs leading-5">
                            Follow some people or create your first post to see content here!
                        </p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            currentUserId={currentUserId}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
