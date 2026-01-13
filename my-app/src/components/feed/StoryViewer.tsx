"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Pause, Play, Send } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { formatDistanceToNow } from "date-fns";
import { Id } from "../../../convex/_generated/dataModel";

interface Story {
    _id: Id<"stories">;
    imageUrl: string;
    createdAt: number;
}

interface StoryAuthor {
    _id: Id<"users">;
    username: string;
    displayName: string;
    avatarUrl?: string;
}

interface StoryGroup {
    author: StoryAuthor;
    stories: Story[];
}

interface StoryViewerProps {
    storyGroups: StoryGroup[];
    initialGroupIndex: number;
    initialStoryIndex: number;
    onClose: () => void;
    onStoryView?: (storyId: Id<"stories">) => void;
}

const STORY_DURATION = 5000; // 5 seconds per story

export function StoryViewer({
    storyGroups,
    initialGroupIndex,
    initialStoryIndex,
    onClose,
    onStoryView,
}: StoryViewerProps) {
    const [currentGroupIndex, setCurrentGroupIndex] = useState(initialGroupIndex);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);

    const currentGroup = storyGroups[currentGroupIndex];
    const currentStory = currentGroup?.stories[currentStoryIndex];

    const goToNextStory = useCallback(() => {
        if (currentStoryIndex < currentGroup.stories.length - 1) {
            setCurrentStoryIndex((prev) => prev + 1);
            setProgress(0);
        } else if (currentGroupIndex < storyGroups.length - 1) {
            setCurrentGroupIndex((prev) => prev + 1);
            setCurrentStoryIndex(0);
            setProgress(0);
        } else {
            onClose();
        }
    }, [currentStoryIndex, currentGroup, currentGroupIndex, storyGroups.length, onClose]);

    const goToPrevStory = useCallback(() => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex((prev) => prev - 1);
            setProgress(0);
        } else if (currentGroupIndex > 0) {
            setCurrentGroupIndex((prev) => prev - 1);
            const prevGroup = storyGroups[currentGroupIndex - 1];
            setCurrentStoryIndex(prevGroup.stories.length - 1);
            setProgress(0);
        }
    }, [currentStoryIndex, currentGroupIndex, storyGroups]);

    // Progress timer
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    goToNextStory();
                    return 0;
                }
                return prev + (100 / (STORY_DURATION / 100));
            });
        }, 100);

        return () => clearInterval(interval);
    }, [isPaused, goToNextStory]);

    // Reset progress on story change
    useEffect(() => {
        setProgress(0);
        if (currentStory && onStoryView) {
            onStoryView(currentStory._id);
        }
    }, [currentStory?._id]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") goToPrevStory();
            else if (e.key === "ArrowRight") goToNextStory();
            else if (e.key === "Escape") onClose();
            else if (e.key === " ") setIsPaused((prev) => !prev);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [goToPrevStory, goToNextStory, onClose]);

    if (!currentGroup || !currentStory) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 hover:bg-white/10 rounded-full"
                >
                    <X size={24} />
                </button>

                {/* Navigation arrows (desktop) */}
                {currentGroupIndex > 0 && (
                    <button
                        onClick={goToPrevStory}
                        className="hidden md:flex absolute left-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}
                {(currentStoryIndex < currentGroup.stories.length - 1 ||
                    currentGroupIndex < storyGroups.length - 1) && (
                        <button
                            onClick={goToNextStory}
                            className="hidden md:flex absolute right-16 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full"
                        >
                            <ChevronRight size={24} />
                        </button>
                    )}

                {/* Story container */}
                <div className="relative w-full max-w-[420px] h-full max-h-[750px] mx-4">
                    {/* Progress bars */}
                    <div className="absolute top-2 left-2 right-2 z-40 flex gap-1">
                        {currentGroup.stories.map((_, index) => (
                            <div
                                key={index}
                                className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
                            >
                                <div
                                    className="h-full bg-white transition-all duration-100"
                                    style={{
                                        width:
                                            index < currentStoryIndex
                                                ? "100%"
                                                : index === currentStoryIndex
                                                    ? `${progress}%`
                                                    : "0%",
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Header */}
                    <div className="absolute top-6 left-0 right-0 z-40 flex items-center justify-between px-3">
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={currentGroup.author.avatarUrl}
                                alt={currentGroup.author.username}
                                size="sm"
                            />
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">
                                    {currentGroup.author.username}
                                </span>
                                <span className="text-xs text-white/60">
                                    {formatDistanceToNow(currentStory.createdAt, { addSuffix: true })}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsPaused((prev) => !prev)}
                            className="p-2 hover:bg-white/10 rounded-full"
                        >
                            {isPaused ? <Play size={20} /> : <Pause size={20} />}
                        </button>
                    </div>

                    {/* Story image */}
                    <div
                        className="absolute inset-0 rounded-lg overflow-hidden"
                        onMouseDown={() => setIsPaused(true)}
                        onMouseUp={() => setIsPaused(false)}
                        onTouchStart={() => setIsPaused(true)}
                        onTouchEnd={() => setIsPaused(false)}
                    >
                        <Image
                            src={currentStory.imageUrl}
                            alt="Story"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Tap zones */}
                        <div className="absolute inset-0 flex">
                            <div className="w-1/3 h-full" onClick={goToPrevStory} />
                            <div className="w-1/3 h-full" />
                            <div className="w-1/3 h-full" onClick={goToNextStory} />
                        </div>
                    </div>

                    {/* Reply input */}
                    <div className="absolute bottom-4 left-3 right-3 z-40 flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Send message..."
                            className="flex-1 px-4 py-3 rounded-full border border-white/30 bg-transparent text-sm placeholder:text-white/50 focus:outline-none focus:border-white/60"
                        />
                        <button className="p-2 hover:bg-white/10 rounded-full">
                            <Send size={24} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
