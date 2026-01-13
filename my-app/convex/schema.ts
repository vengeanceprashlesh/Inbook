import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Users table
    users: defineTable({
        username: v.string(),
        displayName: v.string(),
        bio: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
        website: v.optional(v.string()),
        followersCount: v.number(),
        followingCount: v.number(),
        postsCount: v.number(),
        isVerified: v.optional(v.boolean()),
        createdAt: v.number(),
    })
        .index("by_username", ["username"]),

    // Posts table
    posts: defineTable({
        authorId: v.id("users"),
        imageUrl: v.string(),
        caption: v.optional(v.string()),
        location: v.optional(v.string()),
        likesCount: v.number(),
        commentsCount: v.number(),
        createdAt: v.number(),
    })
        .index("by_author", ["authorId"])
        .index("by_created", ["createdAt"]),

    // Likes table
    likes: defineTable({
        userId: v.id("users"),
        postId: v.id("posts"),
        createdAt: v.number(),
    })
        .index("by_post", ["postId"])
        .index("by_user_post", ["userId", "postId"]),

    // Comments table
    comments: defineTable({
        authorId: v.id("users"),
        postId: v.id("posts"),
        text: v.string(),
        createdAt: v.number(),
    })
        .index("by_post", ["postId"]),

    // Stories table
    stories: defineTable({
        authorId: v.id("users"),
        imageUrl: v.string(),
        expiresAt: v.number(), // 24 hours from creation
        viewsCount: v.number(),
        createdAt: v.number(),
    })
        .index("by_author", ["authorId"])
        .index("by_expires", ["expiresAt"]),

    // Story views
    storyViews: defineTable({
        storyId: v.id("stories"),
        viewerId: v.id("users"),
        viewedAt: v.number(),
    })
        .index("by_story", ["storyId"])
        .index("by_viewer_story", ["viewerId", "storyId"]),

    // Follows table
    follows: defineTable({
        followerId: v.id("users"),
        followingId: v.id("users"),
        createdAt: v.number(),
    })
        .index("by_follower", ["followerId"])
        .index("by_following", ["followingId"])
        .index("by_pair", ["followerId", "followingId"]),

    // Notifications table
    notifications: defineTable({
        userId: v.id("users"), // Who receives
        actorId: v.id("users"), // Who triggered
        type: v.union(v.literal("like"), v.literal("comment"), v.literal("follow")),
        postId: v.optional(v.id("posts")),
        commentId: v.optional(v.id("comments")),
        isRead: v.boolean(),
        createdAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_user_read", ["userId", "isRead"]),

    // Saved posts
    savedPosts: defineTable({
        userId: v.id("users"),
        postId: v.id("posts"),
        createdAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_user_post", ["userId", "postId"]),
});
