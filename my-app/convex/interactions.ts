import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Like a post
export const likePost = mutation({
    args: {
        userId: v.id("users"),
        postId: v.id("posts"),
    },
    handler: async (ctx, args) => {
        // Check if already liked
        const existingLike = await ctx.db
            .query("likes")
            .withIndex("by_user_post", (q) =>
                q.eq("userId", args.userId).eq("postId", args.postId)
            )
            .first();

        if (existingLike) return false;

        // Create like
        await ctx.db.insert("likes", {
            userId: args.userId,
            postId: args.postId,
            createdAt: Date.now(),
        });

        // Increment post likes count
        const post = await ctx.db.get(args.postId);
        if (post) {
            await ctx.db.patch(args.postId, {
                likesCount: post.likesCount + 1,
            });
        }

        return true;
    },
});

// Unlike a post
export const unlikePost = mutation({
    args: {
        userId: v.id("users"),
        postId: v.id("posts"),
    },
    handler: async (ctx, args) => {
        const existingLike = await ctx.db
            .query("likes")
            .withIndex("by_user_post", (q) =>
                q.eq("userId", args.userId).eq("postId", args.postId)
            )
            .first();

        if (!existingLike) return false;

        await ctx.db.delete(existingLike._id);

        // Decrement post likes count
        const post = await ctx.db.get(args.postId);
        if (post) {
            await ctx.db.patch(args.postId, {
                likesCount: Math.max(0, post.likesCount - 1),
            });
        }

        return true;
    },
});

// Check if user liked a post
export const hasLiked = query({
    args: {
        userId: v.id("users"),
        postId: v.id("posts"),
    },
    handler: async (ctx, args) => {
        const like = await ctx.db
            .query("likes")
            .withIndex("by_user_post", (q) =>
                q.eq("userId", args.userId).eq("postId", args.postId)
            )
            .first();
        return !!like;
    },
});

// Add comment
export const addComment = mutation({
    args: {
        authorId: v.id("users"),
        postId: v.id("posts"),
        text: v.string(),
    },
    handler: async (ctx, args) => {
        const commentId = await ctx.db.insert("comments", {
            authorId: args.authorId,
            postId: args.postId,
            text: args.text,
            createdAt: Date.now(),
        });

        // Increment post comments count
        const post = await ctx.db.get(args.postId);
        if (post) {
            await ctx.db.patch(args.postId, {
                commentsCount: post.commentsCount + 1,
            });
        }

        return commentId;
    },
});

// Get comments for a post
export const getComments = query({
    args: { postId: v.id("posts") },
    handler: async (ctx, args) => {
        const comments = await ctx.db
            .query("comments")
            .withIndex("by_post", (q) => q.eq("postId", args.postId))
            .order("desc")
            .collect();

        // Enrich with author data
        const enrichedComments = await Promise.all(
            comments.map(async (comment) => {
                const author = await ctx.db.get(comment.authorId);
                return { ...comment, author };
            })
        );

        return enrichedComments;
    },
});

// Delete comment
export const deleteComment = mutation({
    args: { commentId: v.id("comments") },
    handler: async (ctx, args) => {
        const comment = await ctx.db.get(args.commentId);
        if (!comment) return;

        // Decrement post comments count
        const post = await ctx.db.get(comment.postId);
        if (post) {
            await ctx.db.patch(comment.postId, {
                commentsCount: Math.max(0, post.commentsCount - 1),
            });
        }

        await ctx.db.delete(args.commentId);
    },
});

// Follow user
export const followUser = mutation({
    args: {
        followerId: v.id("users"),
        followingId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // Check if already following
        const existingFollow = await ctx.db
            .query("follows")
            .withIndex("by_pair", (q) =>
                q.eq("followerId", args.followerId).eq("followingId", args.followingId)
            )
            .first();

        if (existingFollow) return false;

        await ctx.db.insert("follows", {
            followerId: args.followerId,
            followingId: args.followingId,
            createdAt: Date.now(),
        });

        // Update counts
        const follower = await ctx.db.get(args.followerId);
        const following = await ctx.db.get(args.followingId);

        if (follower) {
            await ctx.db.patch(args.followerId, {
                followingCount: follower.followingCount + 1,
            });
        }
        if (following) {
            await ctx.db.patch(args.followingId, {
                followersCount: following.followersCount + 1,
            });
        }

        return true;
    },
});

// Unfollow user
export const unfollowUser = mutation({
    args: {
        followerId: v.id("users"),
        followingId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const existingFollow = await ctx.db
            .query("follows")
            .withIndex("by_pair", (q) =>
                q.eq("followerId", args.followerId).eq("followingId", args.followingId)
            )
            .first();

        if (!existingFollow) return false;

        await ctx.db.delete(existingFollow._id);

        // Update counts
        const follower = await ctx.db.get(args.followerId);
        const following = await ctx.db.get(args.followingId);

        if (follower) {
            await ctx.db.patch(args.followerId, {
                followingCount: Math.max(0, follower.followingCount - 1),
            });
        }
        if (following) {
            await ctx.db.patch(args.followingId, {
                followersCount: Math.max(0, following.followersCount - 1),
            });
        }

        return true;
    },
});

// Check if following
export const isFollowing = query({
    args: {
        followerId: v.id("users"),
        followingId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const follow = await ctx.db
            .query("follows")
            .withIndex("by_pair", (q) =>
                q.eq("followerId", args.followerId).eq("followingId", args.followingId)
            )
            .first();
        return !!follow;
    },
});

// Get followers
export const getFollowers = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const follows = await ctx.db
            .query("follows")
            .withIndex("by_following", (q) => q.eq("followingId", args.userId))
            .collect();

        const followers = await Promise.all(
            follows.map(async (follow) => {
                return await ctx.db.get(follow.followerId);
            })
        );

        return followers.filter(Boolean);
    },
});

// Get following
export const getFollowing = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const follows = await ctx.db
            .query("follows")
            .withIndex("by_follower", (q) => q.eq("followerId", args.userId))
            .collect();

        const following = await Promise.all(
            follows.map(async (follow) => {
                return await ctx.db.get(follow.followingId);
            })
        );

        return following.filter(Boolean);
    },
});

// Save post
export const savePost = mutation({
    args: {
        userId: v.id("users"),
        postId: v.id("posts"),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("savedPosts")
            .withIndex("by_user_post", (q) =>
                q.eq("userId", args.userId).eq("postId", args.postId)
            )
            .first();

        if (existing) return false;

        await ctx.db.insert("savedPosts", {
            userId: args.userId,
            postId: args.postId,
            createdAt: Date.now(),
        });

        return true;
    },
});

// Unsave post
export const unsavePost = mutation({
    args: {
        userId: v.id("users"),
        postId: v.id("posts"),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("savedPosts")
            .withIndex("by_user_post", (q) =>
                q.eq("userId", args.userId).eq("postId", args.postId)
            )
            .first();

        if (!existing) return false;

        await ctx.db.delete(existing._id);
        return true;
    },
});

// Check if saved
export const hasSaved = query({
    args: {
        userId: v.id("users"),
        postId: v.id("posts"),
    },
    handler: async (ctx, args) => {
        const saved = await ctx.db
            .query("savedPosts")
            .withIndex("by_user_post", (q) =>
                q.eq("userId", args.userId).eq("postId", args.postId)
            )
            .first();
        return !!saved;
    },
});
