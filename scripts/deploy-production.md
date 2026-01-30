# Production Deployment Guide

## Database Migration Issue Fix

### Problem

After merging to `main`, Google login fails in production because the database schema is not updated with new columns (e.g., `isProAccount`).

### Root Cause

Vercel does not automatically run Prisma migrations on deploy. The build process only runs `prisma generate`, not `prisma migrate deploy`.

### Solution

#### Option 1: Run migrations manually after deploy (RECOMMENDED)

```bash
# After Vercel deploy completes, run migrations in Vercel:
# 1. Go to Vercel Project Settings
# 2. Go to Environment Variables
# 3. Ensure DATABASE_URL is set correctly
# 4. Run in Vercel CLI or use a migration script:
pnpm prisma migrate deploy
```

#### Option 2: Add post-deploy hook in Vercel

Add to `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma migrate deploy && next build"
  }
}
```

**WARNING**: This will run migrations on every build, which may not be ideal.

#### Option 3: Use Vercel CLI to run migrations

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Run command in production environment
vercel env pull .env.production
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) pnpm prisma migrate deploy
```

### Current Status

- ✅ All 37 migrations exist in `/prisma/migrations`
- ✅ Local database is up to date
- ✅ Prisma Client is generated correctly
- ❌ Production database may be missing latest migrations

### To Fix Now

1. **Check production database**:
   - Go to Neon Dashboard: https://console.neon.tech
   - Verify `User` table has `isProAccount` column
   - Verify all Workout-related tables exist

2. **If columns are missing**, run migrations:

   ```bash
   # Use production DATABASE_URL from Vercel
   DATABASE_URL="<production-url>" pnpm prisma migrate deploy
   ```

3. **Redeploy Vercel** (if needed):
   - Push any change to trigger rebuild
   - Or use Vercel dashboard "Redeploy" button

### Migrations Added in Latest Release

- `isProAccount` column in User table
- Complete Workout Builder system (20+ tables)
- Gender-specific prescriptions (Male/Female fields)
- Performance tracking integration

### Prevention

Always run `pnpm prisma migrate deploy` after deploying to production when schema changes are made.
