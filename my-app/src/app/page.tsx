"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AppLayout } from "@/components/layout/AppLayout";
import { Feed } from "@/components/feed/Feed";
import { RightSidebar } from "@/components/feed/RightSidebar";
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

  const handleStoryView = async (storyId: Id<"stories">) => {
    if (currentUser) {
      await viewStory({ storyId, viewerId: currentUser._id });
    }
  };

  return (
    <AppLayout>
      {/* Header (mobile only) */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-[#262626] md:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-semibold instagram-gradient-text tracking-tight">
            Inbook
          </h1>
          <div className="flex items-center gap-5">
            <Link href="/notifications" className="relative group">
              <Heart size={26} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
            </Link>
            <Link href="/messages" className="group">
              <MessageCircle size={26} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex justify-center mx-auto md:pt-8 gap-16 max-w-[1024px]">
        {/* Feed Column */}
        <div className="w-full max-w-[630px] flex-shrink-0">
          <Feed currentUserId={currentUser?._id} />
        </div>

        {/* Right Sidebar Column (Desktop) */}
        <div className="hidden xl:block w-[320px] flex-shrink-0">
          <RightSidebar />
        </div>
      </div>

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
