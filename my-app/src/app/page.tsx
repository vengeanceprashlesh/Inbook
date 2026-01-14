"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AppLayout } from "@/components/layout/AppLayout";
import { Feed } from "@/components/feed/Feed";
import { StoryViewer } from "@/components/feed/StoryViewer";
import { Id } from "../../convex/_generated/dataModel";
import { Heart, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const stories = useQuery(api.stories.getActiveStories);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [storyViewerState, setStoryViewerState] = useState({
    groupIndex: 0,
    storyIndex: 0,
  });

  const viewStory = useMutation(api.stories.viewStory);

  const handleStoryView = async (storyId: Id<"stories">) => {
    if (currentUser) {
      await viewStory({ storyId, viewerId: currentUser._id });
    }
  };

  return (
    <AppLayout>
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 bg-white border-b border-[#DBDBDB] z-40">
        <div className="flex items-center justify-between px-4 h-[60px]">
          <h1 className="text-2xl font-semibold">Instagram</h1>
          <div className="flex items-center gap-6">
            <Link href="/notifications">
              <Heart size={24} strokeWidth={1.75} />
            </Link>
            <Link href="/messages">
              <Send size={24} strokeWidth={1.75} />
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
