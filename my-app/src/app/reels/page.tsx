"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Film, Play, Heart, MessageCircle, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

// Demo reels data
const demoReels = [
    {
        id: "1",
        videoUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=800&fit=crop",
        author: { username: "travel_vibes", avatarUrl: null },
        caption: "Amazing sunset views 🌅 #travel #sunset",
        likes: 12500,
        comments: 342,
    },
    {
        id: "2",
        videoUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=800&fit=crop",
        author: { username: "nature_lover", avatarUrl: null },
        caption: "Nature is healing ✨ #nature #peace",
        likes: 8900,
        comments: 156,
    },
    {
        id: "3",
        videoUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=800&fit=crop",
        author: { username: "adventure_time", avatarUrl: null },
        caption: "Mountains calling 🏔️ #adventure #mountains",
        likes: 15600,
        comments: 489,
    },
];

export default function ReelsPage() {
    const [currentReel, setCurrentReel] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [likedReels, setLikedReels] = useState<Set<string>>(new Set());

    const handleLike = (reelId: string) => {
        setLikedReels((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(reelId)) {
                newSet.delete(reelId);
            } else {
                newSet.add(reelId);
            }
            return newSet;
        });
    };

    const formatCount = (count: number) => {
        if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
        if (count >= 1000) return (count / 1000).toFixed(1) + "K";
        return count.toString();
    };

    return (
        <AppLayout>
            <div className="relative h-[calc(100vh-48px)] md:h-screen overflow-hidden bg-black">
                {/* Reels container */}
                <div className="h-full snap-y snap-mandatory overflow-y-scroll hide-scrollbar">
                    {demoReels.map((reel, index) => (
                        <div
                            key={reel.id}
                            className="relative h-full snap-start flex items-center justify-center"
                        >
                            {/* Video/Image */}
                            <div className="relative w-full max-w-[420px] h-full">
                                <Image
                                    src={reel.videoUrl}
                                    alt={reel.caption}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                />

                                {/* Play icon overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <Play size={80} className="text-white/80" fill="white" />
                                </div>

                                {/* Right side actions */}
                                <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6">
                                    {/* Like */}
                                    <button
                                        onClick={() => handleLike(reel.id)}
                                        className="flex flex-col items-center gap-1"
                                    >
                                        <Heart
                                            size={28}
                                            className={
                                                likedReels.has(reel.id)
                                                    ? "text-[#ed4956] fill-[#ed4956]"
                                                    : "text-white"
                                            }
                                            fill={likedReels.has(reel.id) ? "#ed4956" : "none"}
                                        />
                                        <span className="text-xs">
                                            {formatCount(
                                                reel.likes + (likedReels.has(reel.id) ? 1 : 0)
                                            )}
                                        </span>
                                    </button>

                                    {/* Comment */}
                                    <button className="flex flex-col items-center gap-1">
                                        <MessageCircle size={28} className="text-white" />
                                        <span className="text-xs">{formatCount(reel.comments)}</span>
                                    </button>

                                    {/* Share */}
                                    <button className="flex flex-col items-center gap-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-7 h-7"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                            />
                                        </svg>
                                    </button>

                                    {/* More */}
                                    <button>
                                        <div className="w-7 h-7 flex items-center justify-center">
                                            <div className="flex gap-1">
                                                <div className="w-1 h-1 bg-white rounded-full" />
                                                <div className="w-1 h-1 bg-white rounded-full" />
                                                <div className="w-1 h-1 bg-white rounded-full" />
                                            </div>
                                        </div>
                                    </button>

                                    {/* Audio */}
                                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/30">
                                        <Image
                                            src={reel.videoUrl}
                                            alt="Audio"
                                            width={32}
                                            height={32}
                                            className="w-full h-full object-cover animate-spin-slow"
                                        />
                                    </div>
                                </div>

                                {/* Bottom info */}
                                <div className="absolute bottom-4 left-3 right-16">
                                    {/* Author */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 p-0.5">
                                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-semibold">
                                                {reel.author.username[0].toUpperCase()}
                                            </div>
                                        </div>
                                        <span className="font-semibold text-sm">
                                            {reel.author.username}
                                        </span>
                                        <button className="text-xs border border-white rounded px-2 py-0.5">
                                            Follow
                                        </button>
                                    </div>

                                    {/* Caption */}
                                    <p className="text-sm line-clamp-2">{reel.caption}</p>

                                    {/* Audio */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex items-center gap-1 text-xs bg-white/20 rounded-full px-2 py-1">
                                            <Volume2 size={12} />
                                            <span>Original audio</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mute toggle */}
                                <button
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="absolute bottom-4 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
                                >
                                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty state fallback */}
                {demoReels.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                        <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center mb-4">
                            <Film size={32} strokeWidth={1} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Reels</h3>
                        <p className="text-[#a8a8a8]">
                            Watch short, fun videos from creators
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
