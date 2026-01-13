import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get user by ID
export const getUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.userId);
    },
});

// Get user by username
export const getUserByUsername = query({
    args: { username: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username))
            .first();
    },
});

// Get all users (for demo/explore)
export const getAllUsers = query({
    handler: async (ctx) => {
        return await ctx.db.query("users").collect();
    },
});

// Create user
export const createUser = mutation({
    args: {
        username: v.string(),
        displayName: v.string(),
        bio: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await ctx.db.insert("users", {
            username: args.username,
            displayName: args.displayName,
            bio: args.bio || "",
            avatarUrl: args.avatarUrl || "",
            website: "",
            followersCount: 0,
            followingCount: 0,
            postsCount: 0,
            isVerified: false,
            createdAt: Date.now(),
        });
        return userId;
    },
});

// Update user profile
export const updateProfile = mutation({
    args: {
        userId: v.id("users"),
        displayName: v.optional(v.string()),
        bio: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
        website: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { userId, ...updates } = args;
        const filteredUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, v]) => v !== undefined)
        );
        await ctx.db.patch(userId, filteredUpdates);
    },
});

// Search users
export const searchUsers = query({
    args: { searchTerm: v.string() },
    handler: async (ctx, args) => {
        const users = await ctx.db.query("users").collect();
        return users.filter(
            (user) =>
                user.username.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
                user.displayName.toLowerCase().includes(args.searchTerm.toLowerCase())
        );
    },
});

// Get current user (demo - returns first user or null)
export const getCurrentUser = query({
    handler: async (ctx) => {
        const users = await ctx.db.query("users").take(1);
        return users[0] || null;
    },
});
