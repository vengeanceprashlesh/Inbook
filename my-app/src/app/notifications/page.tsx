"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AppLayout } from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/Avatar";
import { Heart, MessageCircle, UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsPage() {
    const currentUser = useQuery(api.users.getCurrentUser);

    // Mock notifications for demo
    const notifications = [
        {
            id: "1",
            type: "like" as const,
            user: { username: "john_doe", avatarUrl: null },
            createdAt: Date.now() - 1000 * 60 * 5,
        },
        {
            id: "2",
            type: "follow" as const,
            user: { username: "jane_smith", avatarUrl: null },
            createdAt: Date.now() - 1000 * 60 * 60,
        },
        {
            id: "3",
            type: "comment" as const,
            user: { username: "alex_dev", avatarUrl: null },
            text: "Great photo! 🔥",
            createdAt: Date.now() - 1000 * 60 * 60 * 3,
        },
        {
            id: "4",
            type: "like" as const,
            user: { username: "photo_lover", avatarUrl: null },
            createdAt: Date.now() - 1000 * 60 * 60 * 24,
        },
    ];

    const getNotificationIcon = (type: "like" | "follow" | "comment") => {
        switch (type) {
            case "like":
                return <Heart size={16} className="text-[#ed4956] fill-[#ed4956]" />;
            case "follow":
                return <UserPlus size={16} className="text-[#0095f6]" />;
            case "comment":
                return <MessageCircle size={16} className="text-[#a8a8a8]" />;
        }
    };

    const getNotificationText = (notification: (typeof notifications)[0]) => {
        switch (notification.type) {
            case "like":
                return "liked your photo.";
            case "follow":
                return "started following you.";
            case "comment":
                return `commented: ${notification.text}`;
        }
    };

    return (
        <AppLayout>
            {/* Header */}
            <header className="sticky top-0 z-40 bg-black border-b border-[#262626]">
                <div className="flex items-center h-11 px-4">
                    <button
                        onClick={() => window.history.back()}
                        className="md:hidden mr-4"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="font-semibold text-lg">Notifications</h1>
                </div>
            </header>

            {/* Notifications list */}
            <div className="divide-y divide-[#262626]">
                {/* Today section */}
                <div>
                    <h2 className="px-4 py-3 font-semibold">Today</h2>
                    {notifications
                        .filter((n) => n.createdAt > Date.now() - 1000 * 60 * 60 * 24)
                        .map((notification) => (
                            <div
                                key={notification.id}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5"
                            >
                                <Avatar
                                    src={notification.user.avatarUrl}
                                    alt={notification.user.username}
                                    size="md"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm">
                                        <Link
                                            href={`/profile/${notification.user.username}`}
                                            className="font-semibold"
                                        >
                                            {notification.user.username}
                                        </Link>{" "}
                                        {getNotificationText(notification)}{" "}
                                        <span className="text-[#a8a8a8]">
                                            {formatDistanceToNow(notification.createdAt, {
                                                addSuffix: false,
                                            })}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getNotificationIcon(notification.type)}
                                    {notification.type === "follow" && (
                                        <button className="btn-primary text-sm py-1.5 px-4">
                                            Follow
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>

                {/* This week section */}
                <div>
                    <h2 className="px-4 py-3 font-semibold">This Week</h2>
                    {notifications
                        .filter((n) => n.createdAt <= Date.now() - 1000 * 60 * 60 * 24)
                        .map((notification) => (
                            <div
                                key={notification.id}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5"
                            >
                                <Avatar
                                    src={notification.user.avatarUrl}
                                    alt={notification.user.username}
                                    size="md"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm">
                                        <Link
                                            href={`/profile/${notification.user.username}`}
                                            className="font-semibold"
                                        >
                                            {notification.user.username}
                                        </Link>{" "}
                                        {getNotificationText(notification)}{" "}
                                        <span className="text-[#a8a8a8]">
                                            {formatDistanceToNow(notification.createdAt, {
                                                addSuffix: false,
                                            })}
                                        </span>
                                    </p>
                                </div>
                                {getNotificationIcon(notification.type)}
                            </div>
                        ))}
                </div>
            </div>

            {/* Empty state */}
            {notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center mb-4">
                        <Heart size={32} strokeWidth={1} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Activity</h3>
                    <p className="text-[#a8a8a8]">
                        When someone likes or comments on your posts, you'll see it here.
                    </p>
                </div>
            )}
        </AppLayout>
    );
}
