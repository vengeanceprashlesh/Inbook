import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const STORY_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms

// Create a new story
export const createStory = mutation({
    args: {
        authorId: v.id("users"),
        imageUrl: v.string(),
    },
    handler: async (ctx, args) => {
        const storyId = await ctx.db.insert("stories", {
            authorId: args.authorId,
            imageUrl: args.imageUrl,
            expiresAt: Date.now() + STORY_DURATION,
            viewsCount: 0,
            createdAt: Date.now(),
        });
        return storyId;
    },
});

// Get active stories (not expired)
export const getActiveStories = query({
    handler: async (ctx) => {
        const now = Date.now();
        const stories = await ctx.db
            .query("stories")
            .withIndex("by_expires")
            .filter((q) => q.gt(q.field("expiresAt"), now))
            .order("desc")
            .collect();

        // Group by author
        const storiesByAuthor = new Map();

        for (const story of stories) {
            const author = await ctx.db.get(story.authorId);
            if (!author) continue;

            if (!storiesByAuthor.has(story.authorId)) {
                storiesByAuthor.set(story.authorId, {
                    author,
                    stories: [],
                });
            }
            storiesByAuthor.get(story.authorId).stories.push(story);
        }

        return Array.from(storiesByAuthor.values());
    },
});

// Get stories by user
export const getUserStories = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const now = Date.now();
        return await ctx.db
            .query("stories")
            .withIndex("by_author", (q) => q.eq("authorId", args.userId))
            .filter((q) => q.gt(q.field("expiresAt"), now))
            .order("desc")
            .collect();
    },
});

// View a story
export const viewStory = mutation({
    args: {
        storyId: v.id("stories"),
        viewerId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // Check if already viewed
        const existingView = await ctx.db
            .query("storyViews")
            .withIndex("by_viewer_story", (q) =>
                q.eq("viewerId", args.viewerId).eq("storyId", args.storyId)
            )
            .first();

        if (existingView) return false;

        await ctx.db.insert("storyViews", {
            storyId: args.storyId,
            viewerId: args.viewerId,
            viewedAt: Date.now(),
        });

        // Increment views count
        const story = await ctx.db.get(args.storyId);
        if (story) {
            await ctx.db.patch(args.storyId, {
                viewsCount: story.viewsCount + 1,
            });
        }

        return true;
    },
});

// Get story viewers
export const getStoryViewers = query({
    args: { storyId: v.id("stories") },
    handler: async (ctx, args) => {
        const views = await ctx.db
            .query("storyViews")
            .withIndex("by_story", (q) => q.eq("storyId", args.storyId))
            .collect();

        const viewers = await Promise.all(
            views.map(async (view) => {
                const user = await ctx.db.get(view.viewerId);
                return { ...view, user };
            })
        );

        return viewers;
    },
});

// Has user viewed story
export const hasViewedStory = query({
    args: {
        storyId: v.id("stories"),
        viewerId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const view = await ctx.db
            .query("storyViews")
            .withIndex("by_viewer_story", (q) =>
                q.eq("viewerId", args.viewerId).eq("storyId", args.storyId)
            )
            .first();
        return !!view;
    },
});

// Delete expired stories (cleanup function)
export const cleanupExpiredStories = mutation({
    handler: async (ctx) => {
        const now = Date.now();
        const expiredStories = await ctx.db
            .query("stories")
            .withIndex("by_expires")
            .filter((q) => q.lt(q.field("expiresAt"), now))
            .collect();

        for (const story of expiredStories) {
            // Delete views
            const views = await ctx.db
                .query("storyViews")
                .withIndex("by_story", (q) => q.eq("storyId", story._id))
                .collect();

            for (const view of views) {
                await ctx.db.delete(view._id);
            }

            await ctx.db.delete(story._id);
        }

        return expiredStories.length;
    },
});
