"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AppLayout } from "@/components/layout/AppLayout";
import { Feed } from "@/components/feed/Feed";
import { StoryViewer } from "@/components/feed/StoryViewer";
import { Id } from "../../convex/_generated/dataModel";

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
