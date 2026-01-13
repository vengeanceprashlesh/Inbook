import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a new post
export const createPost = mutation({
    args: {
        authorId: v.id("users"),
        imageUrl: v.string(),
        caption: v.optional(v.string()),
        location: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const postId = await ctx.db.insert("posts", {
            authorId: args.authorId,
            imageUrl: args.imageUrl,
            caption: args.caption || "",
            location: args.location || "",
            likesCount: 0,
            commentsCount: 0,
            createdAt: Date.now(),
        });

        // Increment user's post count
        const user = await ctx.db.get(args.authorId);
        if (user) {
            await ctx.db.patch(args.authorId, {
                postsCount: user.postsCount + 1,
            });
        }

        return postId;
    },
});

// Get feed posts (all posts, sorted by date)
export const getFeed = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const limit = args.limit || 20;
        const posts = await ctx.db
            .query("posts")
            .withIndex("by_created")
            .order("desc")
            .take(limit);

        // Enrich with author data
        const enrichedPosts = await Promise.all(
            posts.map(async (post) => {
                const author = await ctx.db.get(post.authorId);
                return { ...post, author };
            })
        );

        return enrichedPosts;
    },
});

// Get single post by ID
export const getPost = query({
    args: { postId: v.id("posts") },
    handler: async (ctx, args) => {
        const post = await ctx.db.get(args.postId);
        if (!post) return null;

        const author = await ctx.db.get(post.authorId);
        return { ...post, author };
    },
});

// Get posts by user
export const getUserPosts = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("posts")
            .withIndex("by_author", (q) => q.eq("authorId", args.userId))
            .order("desc")
            .collect();
    },
});

// Delete post
export const deletePost = mutation({
    args: { postId: v.id("posts") },
    handler: async (ctx, args) => {
        const post = await ctx.db.get(args.postId);
        if (!post) return;

        // Delete associated likes
        const likes = await ctx.db
            .query("likes")
            .withIndex("by_post", (q) => q.eq("postId", args.postId))
            .collect();
        for (const like of likes) {
            await ctx.db.delete(like._id);
        }

        // Delete associated comments
        const comments = await ctx.db
            .query("comments")
            .withIndex("by_post", (q) => q.eq("postId", args.postId))
            .collect();
        for (const comment of comments) {
            await ctx.db.delete(comment._id);
        }

        // Decrement user's post count
        const user = await ctx.db.get(post.authorId);
        if (user) {
            await ctx.db.patch(post.authorId, {
                postsCount: Math.max(0, user.postsCount - 1),
            });
        }

        await ctx.db.delete(args.postId);
    },
});

// Get explore posts (random/popular)
export const getExplorePosts = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const limit = args.limit || 30;
        const posts = await ctx.db
            .query("posts")
            .order("desc")
            .take(limit);

        return posts;
    },
});
