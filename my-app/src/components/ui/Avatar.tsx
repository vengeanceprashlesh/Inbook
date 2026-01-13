"use client";

import Image from "next/image";
import { User } from "lucide-react";

interface AvatarProps {
    src?: string | null;
    alt?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    hasStory?: boolean;
    storyViewed?: boolean;
    onClick?: () => void;
    className?: string;
}

const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-14 h-14",
    xl: "w-[74px] h-[74px]", // Standard Story size ~72-74px
};

const storySizes = {
    xs: "p-[1.5px]",
    sm: "p-[2px]",
    md: "p-[2px]",
    lg: "p-[2.5px]",
    xl: "p-[2.5px]",
};

export function Avatar({
    src,
    alt = "User avatar",
    size = "md",
    hasStory = false,
    storyViewed = false,
    onClick,
    className = "",
}: AvatarProps) {
    const sizeClass = sizeClasses[size];
    const storyPadding = storySizes[size];

    const avatarContent = (
        <div
            className={`${sizeClass} rounded-full overflow-hidden bg-[#262626] flex items-center justify-center`}
        >
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                />
            ) : (
                <User className="w-1/2 h-1/2 text-[#a8a8a8]" />
            )}
        </div>
    );

    if (hasStory) {
        return (
            <button
                onClick={onClick}
                className={`${storyViewed ? "story-ring-seen" : "story-ring"
                    } ${storyPadding} rounded-full ${className}`}
            >
                <div className="story-ring-inner">{avatarContent}</div>
            </button>
        );
    }

    if (onClick) {
        return (
            <button onClick={onClick} className={className}>
                {avatarContent}
            </button>
        );
    }

    return <div className={className}>{avatarContent}</div>;
}

interface AvatarGroupProps {
    avatars: { src?: string; alt?: string }[];
    max?: number;
    size?: "xs" | "sm" | "md";
}

export function AvatarGroup({ avatars, max = 3, size = "sm" }: AvatarGroupProps) {
    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;

    return (
        <div className="flex -space-x-2">
            {visibleAvatars.map((avatar, index) => (
                <div
                    key={index}
                    className="ring-2 ring-black rounded-full"
                    style={{ zIndex: max - index }}
                >
                    <Avatar src={avatar.src} alt={avatar.alt} size={size} />
                </div>
            ))}
            {remainingCount > 0 && (
                <div
                    className={`${sizeClasses[size]} rounded-full bg-[#363636] flex items-center justify-center text-xs font-medium ring-2 ring-black`}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    );
}
