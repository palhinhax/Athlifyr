# Athlifyr MVP - Deployment Guide

## Quick Start

### Prerequisites

- PostgreSQL database (local or hosted)
- Node.js 18+ installed
- npm installed

### Setup Instructions

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Create a `.env` file:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/athlifyr"
   ```

3. **Run database migrations**

   ```bash
   npm run db:push
   ```

4. **Seed the database**

   ```bash
   npm run db:seed
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000)

## Production Deployment (Vercel)

### Step 1: Push to GitHub

Ensure your code is pushed to a GitHub repository.

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Athlifyr repository

### Step 3: Configure Database

You'll need a PostgreSQL database. Options:

- **Vercel Postgres** (recommended)
- **Neon** (free tier available)
- **Railway**
- **Supabase**

### Step 4: Set Environment Variables

In Vercel project settings, add:

```
DATABASE_URL=your_production_database_url
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

### Step 5: Deploy

1. Click "Deploy"
2. After deployment, run migrations in Vercel CLI:
   ```bash
   vercel env pull .env.production
   npm run db:push
   npm run db:seed
   ```

Or use Vercel dashboard to run these commands.

## Database Management

### View/Edit Data

```bash
npm run db:studio
```

This opens Prisma Studio at http://localhost:5555

### Reset Database

```bash
npm run db:push -- --force-reset
npm run db:seed
```

## Features Implemented

### MVP Scope ✅

- ✅ Home page with hero and quick filters
- ✅ Events listing with sport type filters
- ✅ Individual event pages
- ✅ SEO optimization (metadata, sitemap, robots.txt)
- ✅ 40+ seed events for Portugal
- ✅ Responsive design

### Out of Scope (Future Features)

- ❌ User authentication
- ❌ User comments
- ❌ Event creation by users
- ❌ Payment processing
- ❌ Admin dashboard
- ❌ User favorites/alerts

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **UI**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel-ready

## Project Structure

```
app/
├── events/              # Events pages
│   ├── page.tsx        # Events listing
│   └── [slug]/         # Individual event
├── layout.tsx          # Root layout
├── page.tsx            # Home page
├── sitemap.ts          # SEO sitemap
└── robots.ts           # Robots.txt

components/
├── event-card.tsx      # Event card component
└── ui/                 # shadcn/ui components

prisma/
├── schema.prisma       # Database schema
└── seed.ts             # Seed data (40+ events)
```

## Troubleshooting

### Build fails

- Make sure DATABASE_URL is not required at build time
- The app is configured to work without database at build time

### No events showing

- Run the seed script: `npm run db:seed`
- Check database connection in Prisma Studio

### Images not loading

- Unsplash images are used in seed data
- These are free placeholder images
- In production, you may want to use your own CDN

## Next Steps

1. **Add more events**: Edit `prisma/seed.ts` and run `npm run db:seed`
2. **Customize branding**: Update colors in `tailwind.config.ts`
3. **Add analytics**: Integrate Google Analytics or similar
4. **Custom domain**: Configure in Vercel dashboard
5. **Monitor**: Set up Vercel Analytics or other monitoring

## Support

For issues, check:

- Next.js docs: https://nextjs.org/docs
- Prisma docs: https://www.prisma.io/docs
- Vercel docs: https://vercel.com/docs
