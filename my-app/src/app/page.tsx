"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AppLayout } from "@/components/layout/AppLayout";
import { Feed } from "@/components/feed/Feed";
import { StoryViewer } from "@/components/feed/StoryViewer";
import { Id } from "../../convex/_generated/dataModel";
import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const stories = useQuery(api.stories.getActiveStories);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [storyViewerState, setStoryViewerState] = useState({
    groupIndex: 0,
    storyIndex: 0,
  });

  const viewStory = useMutation(api.stories.viewStory);

  const handleStoryClick = (authorId: Id<"users">, storyIndex: number) => {
    if (!stories) return;
    const groupIndex = stories.findIndex((g) => g.author._id === authorId);
    if (groupIndex >= 0) {
      setStoryViewerState({ groupIndex, storyIndex });
      setShowStoryViewer(true);
    }
  };

  const handleStoryView = async (storyId: Id<"stories">) => {
    if (currentUser) {
      await viewStory({ storyId, viewerId: currentUser._id });
    }
  };

  return (
    <AppLayout>
      {/* Header (mobile) */}
      <header className="sticky top-0 z-40 bg-black border-b border-[#262626] md:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-semibold instagram-gradient-text">
            Inbook
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/notifications" className="relative">
              <Heart size={24} strokeWidth={1.5} />
            </Link>
            <Link href="/messages">
              <MessageCircle size={24} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </header>

      <Feed currentUserId={currentUser?._id} />

      {/* Story Viewer Modal */}
      {showStoryViewer && stories && stories.length > 0 && (
        <StoryViewer
          storyGroups={stories}
          initialGroupIndex={storyViewerState.groupIndex}
          initialStoryIndex={storyViewerState.storyIndex}
          onClose={() => setShowStoryViewer(false)}
          onStoryView={handleStoryView}
        />
      )}
    </AppLayout>
  );
}
