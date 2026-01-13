"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AppLayout } from "@/components/layout/AppLayout";
import {
    ArrowLeft,
    Image as ImageIcon,
    X,
    ChevronRight,
    MapPin,
    Sparkles,
} from "lucide-react";
import Image from "next/image";

type CreateStep = "select" | "edit" | "share";

export default function CreatePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isStory = searchParams.get("type") === "story";

    const [step, setStep] = useState<CreateStep>("select");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [caption, setCaption] = useState("");
    const [location, setLocation] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentUser = useQuery(api.users.getCurrentUser);
    const createPost = useMutation(api.posts.createPost);
    const createStory = useMutation(api.stories.createStory);

    const handleImageSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    setSelectedImage(reader.result as string);
                    setStep("edit");
                };
                reader.readAsDataURL(file);
            }
        },
        []
    );

    const handleShare = async () => {
        if (!selectedImage || !currentUser) return;

        setIsUploading(true);

        try {
            // For demo, we'll use the data URL directly
            // In production, you'd upload to Cloudinary here
            const imageUrl = selectedImage;

            if (isStory) {
                await createStory({
                    authorId: currentUser._id,
                    imageUrl,
                });
            } else {
                await createPost({
                    authorId: currentUser._id,
                    imageUrl,
                    caption: caption || undefined,
                    location: location || undefined,
                });
            }

            router.push("/");
        } catch (error) {
            console.error("Failed to create:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleBack = () => {
        if (step === "edit") {
            setStep("select");
            setSelectedImage(null);
        } else if (step === "share") {
            setStep("edit");
        } else {
            router.back();
        }
    };

    return (
        <AppLayout>
            {/* Header */}
            <header className="sticky top-0 z-40 bg-black border-b border-[#262626]">
                <div className="flex items-center justify-between h-11 px-4">
                    <button onClick={handleBack} className="p-1">
                        {step === "select" ? <X size={24} /> : <ArrowLeft size={24} />}
                    </button>
                    <h1 className="font-semibold">
                        {isStory
                            ? "New Story"
                            : step === "select"
                                ? "New Post"
                                : step === "edit"
                                    ? "Edit"
                                    : "New Post"}
                    </h1>
                    {step === "edit" && (
                        <button
                            onClick={() => setStep("share")}
                            className="text-[#0095f6] font-semibold"
                        >
                            Next
                        </button>
                    )}
                    {step === "share" && (
                        <button
                            onClick={handleShare}
                            disabled={isUploading}
                            className="text-[#0095f6] font-semibold disabled:opacity-50"
                        >
                            {isUploading ? "Sharing..." : "Share"}
                        </button>
                    )}
                    {step === "select" && <div className="w-6" />}
                </div>
            </header>

            {/* Content */}
            <div className="min-h-[calc(100vh-100px)]">
                {step === "select" && (
                    <div className="flex flex-col items-center justify-center py-20 px-8">
                        <div className="w-24 h-24 mb-6 rounded-full border-2 border-white flex items-center justify-center">
                            <ImageIcon size={48} strokeWidth={1} />
                        </div>
                        <h2 className="text-xl mb-2">
                            {isStory ? "Create a Story" : "Create New Post"}
                        </h2>
                        <p className="text-[#a8a8a8] text-center mb-6">
                            {isStory
                                ? "Share a moment that disappears in 24 hours"
                                : "Share photos and videos with your followers"}
                        </p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="btn-primary px-8 py-2.5"
                        >
                            Select from device
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                    </div>
                )}

                {step === "edit" && selectedImage && (
                    <div className="flex flex-col">
                        {/* Image preview */}
                        <div className="relative aspect-square bg-black">
                            <Image
                                src={selectedImage}
                                alt="Preview"
                                fill
                                className="object-contain"
                            />
                        </div>

                        {/* Filter options (simplified) */}
                        <div className="p-4 border-b border-[#262626]">
                            <div className="flex gap-4 overflow-x-auto hide-scrollbar">
                                {["Original", "Clarendon", "Gingham", "Moon", "Lark", "Reyes"].map(
                                    (filter) => (
                                        <button
                                            key={filter}
                                            className="flex flex-col items-center gap-2 flex-shrink-0"
                                        >
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#262626]">
                                                <Image
                                                    src={selectedImage}
                                                    alt={filter}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="text-xs text-[#a8a8a8]">{filter}</span>
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {step === "share" && selectedImage && (
                    <div className="flex flex-col">
                        {/* Image + Caption */}
                        <div className="flex gap-4 p-4 border-b border-[#262626]">
                            <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                                <Image
                                    src={selectedImage}
                                    alt="Preview"
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <textarea
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Write a caption..."
                                className="flex-1 bg-transparent resize-none text-sm focus:outline-none placeholder:text-[#a8a8a8]"
                                rows={3}
                            />
                        </div>

                        {/* Options */}
                        {!isStory && (
                            <>
                                <button className="flex items-center justify-between px-4 py-3 border-b border-[#262626] hover:bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <MapPin size={20} />
                                        <span>{location || "Add location"}</span>
                                    </div>
                                    <ChevronRight size={20} className="text-[#a8a8a8]" />
                                </button>

                                <button className="flex items-center justify-between px-4 py-3 border-b border-[#262626] hover:bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <Sparkles size={20} />
                                        <span>Add AI caption</span>
                                    </div>
                                    <ChevronRight size={20} className="text-[#a8a8a8]" />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
