"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowLeft, Edit, Camera } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// Demo conversations
const conversations = [
    {
        id: "1",
        user: { username: "alex_photography", displayName: "Alex Chen", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop" },
        lastMessage: "That photo turned out amazing! 📸",
        timestamp: Date.now() - 1000 * 60 * 5,
        unread: true,
    },
    {
        id: "2",
        user: { username: "travel_jane", displayName: "Jane Explorer", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
        lastMessage: "See you at the meetup!",
        timestamp: Date.now() - 1000 * 60 * 60,
        unread: false,
    },
    {
        id: "3",
        user: { username: "nature_mike", displayName: "Mike Wilson", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
        lastMessage: "Thanks for the tips on wildlife photography",
        timestamp: Date.now() - 1000 * 60 * 60 * 3,
        unread: false,
    },
];

export default function MessagesPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const formatTime = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        if (diff < 1000 * 60 * 60) return `${Math.floor(diff / 1000 / 60)}m`;
        if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / 1000 / 60 / 60)}h`;
        return `${Math.floor(diff / 1000 / 60 / 60 / 24)}d`;
    };

    return (
        <AppLayout>
            {/* Header */}
            <header className="sticky top-0 z-40 bg-black border-b border-[#262626]">
                <div className="flex items-center justify-between h-11 px-4">
                    <button onClick={() => window.history.back()} className="md:hidden">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center gap-1 font-semibold">
                        <span>Messages</span>
                    </div>
                    <button>
                        <Edit size={24} />
                    </button>
                </div>
            </header>

            {/* Search */}
            <div className="px-4 py-2">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-[#262626] rounded-lg text-sm placeholder:text-[#a8a8a8] focus:outline-none"
                />
            </div>

            {/* Messages/Requests toggle */}
            <div className="flex px-4 py-2 gap-2">
                <button className="flex-1 py-2 bg-white text-black rounded-lg font-semibold text-sm">
                    Messages
                </button>
                <button className="flex-1 py-2 bg-[#262626] rounded-lg font-semibold text-sm">
                    Requests
                </button>
            </div>

            {/* Conversations */}
            <div className="divide-y divide-[#262626]">
                {conversations.map((conversation) => (
                    <Link
                        key={conversation.id}
                        href={`/messages/${conversation.id}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5"
                    >
                        <Avatar
                            src={conversation.user.avatarUrl}
                            alt={conversation.user.username}
                            size="lg"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${conversation.unread ? "font-semibold" : ""}`}>
                                    {conversation.user.displayName}
                                </span>
                                <span className="text-xs text-[#a8a8a8]">
                                    {formatTime(conversation.timestamp)}
                                </span>
                            </div>
                            <p className={`text-sm truncate ${conversation.unread ? "text-white" : "text-[#a8a8a8]"}`}>
                                {conversation.lastMessage}
                            </p>
                        </div>
                        {conversation.unread && (
                            <div className="w-2 h-2 bg-[#0095f6] rounded-full" />
                        )}
                        <button className="p-2">
                            <Camera size={20} className="text-[#a8a8a8]" />
                        </button>
                    </Link>
                ))}
            </div>

            {/* Empty state */}
            {conversations.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center mb-4">
                        <Edit size={32} strokeWidth={1} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
                    <p className="text-[#a8a8a8] mb-4">
                        Send private photos and messages to a friend or group
                    </p>
                    <button className="btn-primary">Send Message</button>
                </div>
            )}
        </AppLayout>
    );
}
