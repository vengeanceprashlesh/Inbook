"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { PostCard, PostCardSkeleton } from "./PostCard";
import { StoriesBar, StoriesBarSkeleton } from "./StoriesBar";
import { RightSidebar } from "./RightSidebar";
import { Id } from "../../../convex/_generated/dataModel";

interface FeedProps {
    currentUserId?: Id<"users">;
}

export function Feed({ currentUserId }: FeedProps) {
    const posts = useQuery(api.posts.getFeed, { limit: 20 });
    const stories = useQuery(api.stories.getActiveStories);

    const isLoading = posts === undefined || stories === undefined;

    return (
        <div className="flex justify-center pt-6 pb-20 md:pb-8">
            <div className="w-full max-w-[470px]">
                {isLoading ? (
                    <>
                        <StoriesBarSkeleton />
                        {[1, 2, 3].map((i) => (
                            <PostCardSkeleton key={i} />
                        ))}
                    </>
                ) : (
                    <>
                        <StoriesBar
                            storyGroups={stories}
                            currentUserId={currentUserId}
                            onCreateStory={() => {
                                window.location.href = "/create?type=story";
                            }}
                        />

                        {posts.length === 0 ? (
                            <div className="text-center py-20 bg-white">
                                <p className="text-[#8E8E8E]">No posts yet</p>
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
                    </>
                )}
            </div>

            {/* Right Sidebar - Hidden on small/medium, shown on XL */}
            <div className="hidden xl:block ml-16">
                <div className="fixed w-[319px]">
                    <RightSidebar />
                </div>
            </div>
        </div>
    );
}
