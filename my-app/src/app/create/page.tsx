"use client";

import { Suspense, useState, useRef, useCallback } from "react";
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
    Smile,
    Maximize2,
} from "lucide-react";
import Image from "next/image";

type CreateStep = "select" | "edit" | "share";

function CreateContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isStory = searchParams.get("type") === "story";

    const [step, setStep] = useState<CreateStep>("select");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [caption, setCaption] = useState("");
    const [location, setLocation] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Original");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentUser = useQuery(api.users.getCurrentUser);
    const createPost = useMutation(api.posts.createPost);
    const createStory = useMutation(api.stories.createStory);

    const filters = ["Original", "Clarendon", "Gingham", "Moon", "Lark", "Reyes", "Juno", "Slumber", "Crema"];

    const handleImageSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                setSelectedFile(file);
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

    const uploadToCloudinary = async (file: File) => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            throw new Error("Please configure Cloudinary credentials in .env.local");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "Upload failed");
        }

        const data = await response.json();
        return data.secure_url;
    };

    const handleShare = async () => {
        if (!selectedImage || !currentUser) return;

        setIsUploading(true);

        try {
            let imageUrl = selectedImage;

            // Only upload if we have a file (not just a data URL we reusing, though here we always select file new)
            if (selectedFile) {
                try {
                    imageUrl = await uploadToCloudinary(selectedFile);
                } catch (e: any) {
                    alert(`Upload failed: ${e.message}. Using local preview for demo.`);
                    // Fallback to local preview for demo if upload fails (e.g. no keys)
                }
            }

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
            // Error handled silently - user will see no update on failure
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
            <div className="flex items-center justify-center min-h-[calc(100vh-60px)] md:px-4 md:py-8">
                {/* Creation "Modal" Container */}
                <div className={`
                    bg-[#262626] md:rounded-xl overflow-hidden w-full max-w-[900px] 
                    flex flex-col md:border border-[#363636] shadow-2xl transition-all duration-500
                    ${step === "select" ? "md:h-[600px] md:w-[600px]" : "md:h-[600px]"}
                    min-h-[100vh] md:min-h-0
                `}>
                    {/* Header */}
                    <div className="h-[44px] border-b border-[#363636] flex items-center justify-between px-4 bg-[#262626] z-10">
                        <button onClick={handleBack} className="p-1 hover:text-white text-[#f5f5f5]">
                            {step === "select" ? <X size={24} /> : <ArrowLeft size={24} />}
                        </button>
                        <h1 className="font-semibold text-[16px]">
                            {isStory ? "Create Story" : step === "select" ? "Create new post" : step === "edit" ? "Edit" : "Create new post"}
                        </h1>
                        {step === "edit" ? (
                            <button
                                onClick={() => setStep("share")}
                                className="text-[#0095f6] font-semibold text-sm hover:text-white transition-colors"
                            >
                                Next
                            </button>
                        ) : step === "share" ? (
                            <button
                                onClick={handleShare}
                                disabled={isUploading}
                                className="text-[#0095f6] font-semibold text-sm hover:text-white transition-colors disabled:opacity-50"
                            >
                                {isUploading ? "Sharing..." : "Share"}
                            </button>
                        ) : (
                            <div className="w-8" />
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col md:flex-row relative bg-black">

                        {/* 1. Selection State */}
                        {step === "select" && (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in">
                                <div className="mb-6 relative group">
                                    <ImageIcon size={64} strokeWidth={1} className="text-white group-hover:scale-110 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-white/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h2 className="text-xl mb-4 font-light">Drag photos and videos here</h2>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="btn-primary px-6 py-2 rounded-lg text-sm font-semibold"
                                >
                                    Select from computer
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

                        {/* 2. Edit & Share States - Split View */}
                        {(step === "edit" || step === "share") && selectedImage && (
                            <>
                                {/* Left: Image Preview */}
                                <div className={`
                                    relative bg-black flex items-center justify-center
                                    ${step === "edit" ? "md:w-[65%]" : "md:w-[60%]"} w-full aspect-square md:aspect-auto
                                    transition-all duration-500 ease-in-out
                                `}>
                                    <Image
                                        src={selectedImage}
                                        alt="Preview"
                                        fill
                                        className="object-contain"
                                        style={{ filter: selectedFilter === "Original" ? "none" : `contrast(1.1) sepia(0.3) saturate(1.2)` }} // Mock filter logic
                                    />
                                    {/* Overlay Action Buttons (Mock) */}
                                    <div className="absolute bottom-4 left-4 flex gap-2">
                                        <button className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors">
                                            <Maximize2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Right: Controls */}
                                <div className={`
                                    flex flex-col bg-[#262626] border-l border-[#363636]
                                    ${step === "edit" ? "md:w-[35%]" : "md:w-[40%]"} w-full
                                    transition-all duration-500 ease-in-out h-full
                                `}>
                                    {/* Edit Mode: Filters */}
                                    {step === "edit" && (
                                        <div className="flex-1 overflow-y-auto p-4 animate-fade-in">
                                            <h3 className="text-[#a8a8a8] font-semibold mb-4 text-sm uppercase tracking-wide">Filters</h3>
                                            <div className="grid grid-cols-3 gap-3">
                                                {filters.map((filter) => (
                                                    <button
                                                        key={filter}
                                                        onClick={() => setSelectedFilter(filter)}
                                                        className={`flex flex-col items-center gap-2 group cursor-pointer`}
                                                    >
                                                        <div className={`
                                                            w-full aspect-square rounded-md overflow-hidden bg-black relative border-2 transition-all
                                                            ${selectedFilter === filter ? "border-[#0095f6]" : "border-transparent group-hover:border-[#363636]"}
                                                        `}>
                                                            <Image
                                                                src={selectedImage}
                                                                alt={filter}
                                                                fill
                                                                className="object-cover"
                                                                sizes="100px"
                                                            />
                                                            {/* Simple overlay to simulate filter look */}
                                                            {filter !== "Original" && (
                                                                <div className="absolute inset-0 bg-[#f5cb95]/20 mix-blend-overlay" />
                                                            )}
                                                        </div>
                                                        <span className={`text-xs ${selectedFilter === filter ? "text-[#0095f6]" : "text-[#a8a8a8]"}`}>
                                                            {filter}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Share Mode: Caption & Metadata */}
                                    {step === "share" && (
                                        <div className="flex-1 flex flex-col animate-fade-in">
                                            {/* User Info */}
                                            <div className="flex items-center gap-3 p-4">
                                                <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden relative">
                                                    {currentUser?.avatarUrl && (
                                                        <Image src={currentUser.avatarUrl} alt="Me" fill className="object-cover" />
                                                    )}
                                                </div>
                                                <span className="font-semibold text-sm">{currentUser?.username}</span>
                                            </div>

                                            {/* Caption Input */}
                                            <div className="px-4 pb-4 border-b border-[#363636]">
                                                <textarea
                                                    value={caption}
                                                    onChange={(e) => setCaption(e.target.value)}
                                                    placeholder="Write a caption..."
                                                    className="w-full h-[150px] bg-transparent resize-none text-[15px] focus:outline-none placeholder:text-[#a8a8a8] leading-relaxed"
                                                />
                                                <div className="flex justify-between items-center text-[#a8a8a8]">
                                                    <Smile size={20} className="cursor-pointer hover:text-white" />
                                                    <span className="text-xs">{caption.length}/2200</span>
                                                </div>
                                            </div>

                                            {/* Meta Options */}
                                            <div className="flex-1">
                                                <button className="w-full flex items-center justify-between p-4 border-b border-[#363636] hover:bg-[#323232] transition-colors">
                                                    <span className="text-[15px]">Add Location</span>
                                                    <MapPin size={20} className="text-white" />
                                                </button>
                                                <button className="w-full flex items-center justify-between p-4 border-b border-[#363636] hover:bg-[#323232] transition-colors">
                                                    <span className="text-[15px]">Accessibility</span>
                                                    <ChevronRight size={20} className="text-[#a8a8a8]" />
                                                </button>
                                                <button className="w-full flex items-center justify-between p-4 border-b border-[#363636] hover:bg-[#323232] transition-colors">
                                                    <span className="text-[15px]">Advanced Settings</span>
                                                    <ChevronRight size={20} className="text-[#a8a8a8]" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function CreateLoading() {
    return (
        <AppLayout>
            <div className="flex items-center justify-center min-h-[calc(100vh-60px)]">
                <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
            </div>
        </AppLayout>
    );
}

export default function CreatePage() {
    return (
        <Suspense fallback={<CreateLoading />}>
            <CreateContent />
        </Suspense>
    );
}
