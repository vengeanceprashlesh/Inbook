"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { PostCard, PostCardSkeleton } from "./PostCard";
import { StoriesBar, StoriesBarSkeleton } from "./StoriesBar";
import { RightSidebar } from "./RightSidebar";
import { Id } from "../../../convex/_generated/dataModel";
import { Camera } from "lucide-react";

interface FeedProps {
    currentUserId?: Id<"users">;
}

export function Feed({ currentUserId }: FeedProps) {
    const posts = useQuery(api.posts.getFeed, { limit: 20 });
    const stories = useQuery(api.stories.getActiveStories);

    const isLoading = posts === undefined || stories === undefined;

    if (isLoading) {
        return (
            <div className="flex">
                <div className="ig-feed">
                    <StoriesBarSkeleton />
                    <div>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <PostCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
                <RightSidebar />
            </div>
        );
    }

    return (
        <div className="flex">
            <div className="ig-feed">
                {/* Stories */}
                <StoriesBar
                    storyGroups={stories}
                    currentUserId={currentUserId}
                    onCreateStory={() => {
                        window.location.href = "/create?type=story";
                    }}
                />

                {/* Posts feed */}
                <div>
                    {posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-full border-2 border-black dark:border-white flex items-center justify-center mb-4">
                                <Camera size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-light mb-2">No Posts Yet</h3>
                            <p className="text-[#737373] text-sm">
                                When you follow people, you'll see their posts here.
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
            <RightSidebar />
        </div>
    );
}
