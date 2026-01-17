# Inbook

A modern, full-featured Instagram clone built with Next.js, TypeScript, and Convex. Experience a pixel-perfect recreation of Instagram's UI with real-time updates and seamless user interactions.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Convex](https://img.shields.io/badge/Convex-1.31.4-orange?style=flat-square)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### Core Functionality
- 📸 **Posts** - Create, like, comment, and save posts with images
- 📖 **Stories** - 24-hour ephemeral stories with view tracking
- 👤 **User Profiles** - Customizable profiles with bio, avatar, and website links
- 💬 **Comments** - Real-time commenting system on posts
- ❤️ **Likes** - Like posts and view like counts
- 🔔 **Notifications** - Real-time notifications for likes, comments, and follows
- 👥 **Follow System** - Follow/unfollow users with follower/following counts
- 💾 **Saved Posts** - Bookmark posts for later viewing
- 📱 **Responsive Design** - Fully responsive mobile and desktop layouts
- 🎬 **Reels** - Short-form video content section
- 🔍 **Explore** - Discover new content and users
- ✉️ **Messages** - Direct messaging interface

### Technical Highlights
- ⚡ **Real-time Updates** - Powered by Convex for instant data synchronization
- 🎨 **Pixel-Perfect UI** - Instagram-accurate design and interactions
- 🖼️ **Image Management** - Cloudinary integration for optimized image delivery
- 🎭 **Smooth Animations** - Framer Motion for fluid UI transitions
- 🎯 **Type Safety** - Full TypeScript implementation
- 📦 **Modern Stack** - Next.js 16 with App Router and React 19

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- npm, yarn, pnpm, or bun
- Convex account ([convex.dev](https://convex.dev))
- Cloudinary account ([cloudinary.com](https://cloudinary.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/inbook.git
   cd inbook
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

   See `env.example` for a complete reference.

4. **Set up Convex**
   ```bash
   npx convex dev
   ```
   
   This will:
   - Initialize your Convex backend
   - Set up the database schema
   - Start the development server

5. **Seed the database (optional)**
   ```bash
   # In a separate terminal
   npx convex run seed:seedDatabase
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
inbook/
├── convex/              # Convex backend
│   ├── schema.ts        # Database schema
│   ├── users.ts         # User queries and mutations
│   ├── posts.ts         # Posts queries and mutations
│   ├── stories.ts       # Stories queries and mutations
│   ├── interactions.ts  # Likes, comments, follows, saves
│   └── seed.ts          # Database seeding
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── page.tsx     # Home feed
│   │   ├── profile/     # User profile pages
│   │   ├── p/[id]/      # Individual post pages
│   │   ├── create/      # Create post page
│   │   ├── explore/     # Explore page
│   │   ├── reels/       # Reels page
│   │   ├── messages/    # Messages page
│   │   ├── notifications/ # Notifications page
│   │   └── onboarding/  # User onboarding
│   └── components/      # React components
│       ├── layout/      # Layout components
│       ├── feed/        # Feed components
│       └── ui/          # Reusable UI components
├── public/              # Static assets
└── package.json
```

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[date-fns](https://date-fns.org/)** - Date manipulation

### Backend
- **[Convex](https://convex.dev/)** - Real-time backend platform
  - Real-time database
  - Server functions
  - Type-safe queries and mutations
  - Built-in authentication support

### Media
- **[Cloudinary](https://cloudinary.com/)** - Image and video management
- **[next-cloudinary](https://next-cloudinary.dev/)** - Next.js integration

## 📊 Database Schema

The application uses Convex with the following main tables:

- **users** - User profiles and authentication
- **posts** - User posts with images and captions
- **stories** - 24-hour ephemeral stories
- **likes** - Post likes tracking
- **comments** - Post comments
- **follows** - User follow relationships
- **notifications** - User notifications
- **savedPosts** - Bookmarked posts
- **storyViews** - Story view tracking

## 🎨 Features in Detail

### Feed
- Chronological post feed with infinite scroll
- Stories bar at the top
- Like, comment, and save functionality
- Real-time updates

### Stories
- 24-hour automatic expiration
- Swipe navigation between stories
- View tracking
- Progress bars for story segments

### Profile
- User information display
- Post grid layout
- Edit profile functionality
- Follow/unfollow buttons
- Follower/following counts

### Create Post
- Image upload with Cloudinary
- Caption and location input
- Instant feed updates

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Convex Development

```bash
# Start Convex development environment
npx convex dev

# Deploy to production
npx convex deploy

# Run a Convex function
npx convex run functionName
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy Convex Backend

```bash
npx convex deploy --prod
```

Update your production environment variables with the production Convex URL.

## 📝 Environment Variables

See `env.example` for a complete list of required environment variables:

- `NEXT_PUBLIC_CONVEX_URL` - Your Convex deployment URL
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` - Cloudinary unsigned upload preset

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Design inspired by [Instagram](https://www.instagram.com/)
- Built with modern web technologies
- Powered by Convex for real-time functionality

---

**Note**: This is a clone project built for educational purposes. It is not affiliated with or endorsed by Instagram or Meta Platforms, Inc.
