"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AppLayout } from "@/components/layout/AppLayout";
import { Camera, X } from "lucide-react";
import Image from "next/image";

export default function OnboardingPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");

    const createUser = useMutation(api.users.createUser);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim()) {
            setError("Username is required");
            return;
        }

        if (!displayName.trim()) {
            setError("Display name is required");
            return;
        }

        // Username validation
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setError("Username can only contain letters, numbers, and underscores");
            return;
        }

        setIsCreating(true);

        try {
            await createUser({
                username: username.toLowerCase(),
                displayName,
                bio: bio || undefined,
                avatarUrl: avatarUrl || undefined,
            });

            router.push("/");
        } catch (err) {
            setError("Failed to create profile. Please try again.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold instagram-gradient-text mb-2">
                        Inbook
                    </h1>
                    <p className="text-[#a8a8a8]">Create your profile to get started</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Avatar */}
                    <div className="flex justify-center mb-6">
                        <button
                            type="button"
                            className="relative w-24 h-24 rounded-full bg-[#262626] flex items-center justify-center overflow-hidden group"
                        >
                            {avatarUrl ? (
                                <>
                                    <Image
                                        src={avatarUrl}
                                        alt="Avatar"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <X size={24} onClick={() => setAvatarUrl("")} />
                                    </div>
                                </>
                            ) : (
                                <Camera size={32} className="text-[#a8a8a8]" />
                            )}
                        </button>
                    </div>

                    {/* Username */}
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toLowerCase())}
                            className="input"
                            maxLength={30}
                        />
                    </div>

                    {/* Display Name */}
                    <div>
                        <input
                            type="text"
                            placeholder="Display Name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="input"
                            maxLength={50}
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <textarea
                            placeholder="Bio (optional)"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="input resize-none"
                            rows={3}
                            maxLength={150}
                        />
                    </div>

                    {/* Error message */}
                    {error && (
                        <p className="text-[#ed4956] text-sm text-center">{error}</p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isCreating || !username.trim() || !displayName.trim()}
                        className="btn-primary w-full py-3 disabled:opacity-50"
                    >
                        {isCreating ? "Creating..." : "Create Profile"}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-[#a8a8a8] text-xs mt-8">
                    By creating a profile, you agree to our Terms and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
