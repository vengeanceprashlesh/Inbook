import { mutation } from "./_generated/server";

// Seed demo data for testing
export const seedDemoData = mutation({
    handler: async (ctx) => {
        // Check if data already exists
        const existingUsers = await ctx.db.query("users").take(1);
        if (existingUsers.length > 0) {
            return { message: "Demo data already exists" };
        }

        // Create demo users
        const user1 = await ctx.db.insert("users", {
            username: "alex_photography",
            displayName: "Alex Chen",
            bio: "📸 Photographer | Travel Enthusiast\n🌍 Exploring the world one photo at a time\n📍 New York",
            avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
            website: "https://alexchen.photo",
            followersCount: 12500,
            followingCount: 890,
            postsCount: 0,
            isVerified: true,
            createdAt: Date.now(),
        });

        const user2 = await ctx.db.insert("users", {
            username: "travel_jane",
            displayName: "Jane Explorer",
            bio: "✈️ Full-time traveler\n🎒 50+ countries visited\n☕ Coffee addict",
            avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
            website: "",
            followersCount: 8900,
            followingCount: 456,
            postsCount: 0,
            isVerified: false,
            createdAt: Date.now(),
        });

        const user3 = await ctx.db.insert("users", {
            username: "nature_mike",
            displayName: "Mike Wilson",
            bio: "🏔️ Nature & Wildlife\n📷 Canon Ambassador\n🌿 Conservation advocate",
            avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
            website: "",
            followersCount: 45000,
            followingCount: 234,
            postsCount: 0,
            isVerified: true,
            createdAt: Date.now(),
        });

        const user4 = await ctx.db.insert("users", {
            username: "foodie_sarah",
            displayName: "Sarah's Kitchen",
            bio: "🍳 Food blogger & chef\n🥗 Healthy recipes daily\n📖 Cookbook author",
            avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
            website: "",
            followersCount: 23000,
            followingCount: 567,
            postsCount: 0,
            isVerified: false,
            createdAt: Date.now(),
        });

        // Create demo posts
        const posts = [
            {
                authorId: user1,
                imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
                caption: "Breathtaking sunset in the mountains 🏔️✨ #mountains #sunset #photography",
                location: "Swiss Alps",
                likesCount: 1250,
                commentsCount: 42,
                createdAt: Date.now() - 1000 * 60 * 60 * 2,
            },
            {
                authorId: user2,
                imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop",
                caption: "Paradise found 🌴🌊 This beach is unreal! #travel #beach #paradise",
                location: "Maldives",
                likesCount: 890,
                commentsCount: 28,
                createdAt: Date.now() - 1000 * 60 * 60 * 5,
            },
            {
                authorId: user3,
                imageUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=800&fit=crop",
                caption: "Early morning wildlife encounter 🦁 Patience is key in wildlife photography",
                location: "Serengeti, Tanzania",
                likesCount: 3400,
                commentsCount: 156,
                createdAt: Date.now() - 1000 * 60 * 60 * 8,
            },
            {
                authorId: user4,
                imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=800&fit=crop",
                caption: "Homemade pasta perfection 🍝 Recipe link in bio! #foodie #homecooking",
                location: "My Kitchen",
                likesCount: 567,
                commentsCount: 89,
                createdAt: Date.now() - 1000 * 60 * 60 * 12,
            },
            {
                authorId: user1,
                imageUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=800&fit=crop",
                caption: "City lights at dusk 🌃 Urban exploration never gets old",
                location: "Tokyo, Japan",
                likesCount: 2100,
                commentsCount: 67,
                createdAt: Date.now() - 1000 * 60 * 60 * 24,
            },
            {
                authorId: user2,
                imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=800&fit=crop",
                caption: "Finding peace in nature 🌲 Sometimes you need to disconnect to reconnect",
                location: "Pacific Northwest",
                likesCount: 1450,
                commentsCount: 34,
                createdAt: Date.now() - 1000 * 60 * 60 * 30,
            },
        ];

        for (const post of posts) {
            await ctx.db.insert("posts", post);
        }

        // Update post counts
        await ctx.db.patch(user1, { postsCount: 2 });
        await ctx.db.patch(user2, { postsCount: 2 });
        await ctx.db.patch(user3, { postsCount: 1 });
        await ctx.db.patch(user4, { postsCount: 1 });

        // Create demo stories
        const storyDuration = 24 * 60 * 60 * 1000;

        await ctx.db.insert("stories", {
            authorId: user1,
            imageUrl: "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=1000&fit=crop",
            expiresAt: Date.now() + storyDuration,
            viewsCount: 234,
            createdAt: Date.now() - 1000 * 60 * 60 * 2,
        });

        await ctx.db.insert("stories", {
            authorId: user2,
            imageUrl: "https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=600&h=1000&fit=crop",
            expiresAt: Date.now() + storyDuration,
            viewsCount: 567,
            createdAt: Date.now() - 1000 * 60 * 60 * 4,
        });

        await ctx.db.insert("stories", {
            authorId: user3,
            imageUrl: "https://images.unsplash.com/photo-1682686581030-7fa4ea2b96c3?w=600&h=1000&fit=crop",
            expiresAt: Date.now() + storyDuration,
            viewsCount: 890,
            createdAt: Date.now() - 1000 * 60 * 60 * 6,
        });

        return { message: "Demo data created successfully!" };
    },
});
