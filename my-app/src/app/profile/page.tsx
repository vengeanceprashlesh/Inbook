"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function ProfileRedirect() {
    const currentUser = useQuery(api.users.getCurrentUser);

    useEffect(() => {
        if (currentUser) {
            redirect(`/profile/${currentUser.username}`);
        }
    }, [currentUser]);

    // While loading or if no user, show profile setup
    if (currentUser === undefined) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
            </div>
        );
    }

    // If no user exists, could redirect to onboarding
    if (currentUser === null) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black px-4 text-center">
                <h1 className="text-2xl font-semibold mb-4">Welcome to Inbook</h1>
                <p className="text-[#a8a8a8] mb-6">
                    Set up your profile to get started
                </p>
                <a href="/onboarding" className="btn-primary">
                    Create Profile
                </a>
            </div>
        );
    }

    return null;
}
