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
        <div className="max-w-[935px] mx-auto pt-8 px-5 flex gap-8">
            {/* Main Feed Column */}
            <div className="flex-1 max-w-[630px]">
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
                            <div className="text-center py-20">
                                <p className="text-[#8E8E8E]">No posts yet. Follow people to see their posts!</p>
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

            {/* Right Sidebar */}
            <div className="hidden xl:block w-[319px] flex-shrink-0">
                <div className="fixed w-[319px] pt-8">
                    <RightSidebar />
                </div>
            </div>
        </div>
    );
}
