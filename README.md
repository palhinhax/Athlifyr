# Athlifyr

**one place. all sports.**

Athlifyr is a public platform for discovering sports events across Portugal. Find races, competitions and challenges near you - from running and trail to HYROX, CrossFit, OCR, BTT, cycling, surf, and triathlon.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router) with TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **UI Components:** shadcn/ui + Tailwind CSS
- **Authentication:** None (Public MVP)

## 📁 Project Structure

```
├── app/
│   ├── events/              # Event listing and detail pages
│   │   ├── page.tsx         # Events listing with filters
│   │   └── [slug]/          # Individual event page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── sitemap.ts           # SEO sitemap
│   └── robots.ts            # Robots.txt
├── components/
│   ├── event-card.tsx       # Event card component
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── event-utils.ts       # Event utilities and formatters
│   └── prisma.ts            # Prisma client
└── prisma/
    ├── schema.prisma        # Database schema
    └── seed.ts              # Database seed data
```

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/palhinhax/Athlifyr.git
   cd Athlifyr
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your database URL:

   ```env
   DATABASE_PG_URL="postgresql://postgres:password@localhost:5432/athlifyr"
   ```

4. Run database migrations:

   ```bash
   npm run db:migrate
   ```

5. Seed the database with Portuguese events:

   ```bash
   npm run db:seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 📜 Available Scripts

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start development server     |
| `npm run build`      | Build for production         |
| `npm run start`      | Start production server      |
| `npm run lint`       | Run ESLint                   |
| `npm run typecheck`  | Run TypeScript type checking |
| `npm run db:migrate` | Run database migrations      |
| `npm run db:seed`    | Seed the database            |
| `npm run db:studio`  | Open Prisma Studio           |

## 🏃 Features

### MVP Scope

- ✅ **Home Page**: Hero, quick filters, upcoming events
- ✅ **Events Listing**: Filterable list of all events
- ✅ **Event Details**: Individual event pages with full information
- ✅ **SEO Optimized**: Clean URLs, metadata, sitemap, and robots.txt
- ✅ **Sport Types**: Running, Trail, HYROX, CrossFit, OCR, BTT, Cycling, Surf, Triathlon, Swimming
- ✅ **Google Analytics**: Integrated tracking for page views and user behavior

### Out of Scope (Future)

- ❌ User authentication
- ❌ User comments
- ❌ Event submissions by users
- ❌ Payment processing
- ❌ Internal event registration
- ❌ Admin dashboard

## 📦 Database Schema

### Event Model

```prisma
model Event {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  description String
  sportType   SportType
  startDate   DateTime
  endDate     DateTime?
  city        String
  country     String
  imageUrl    String?
  externalUrl String
  isFeatured  Boolean
  createdAt   DateTime
  updatedAt   DateTime
}

enum SportType {
  RUNNING
  TRAIL
  HYROX
  CROSSFIT
  OCR
  BTT
  CYCLING
  SURF
  TRIATHLON
  SWIMMING
  OTHER
}
```

## 🌍 Events Included

The seed data includes 40+ real and semi-fictional Portuguese sports events:

- **Running**: Maratona de Lisboa, Meia Maratona de Lisboa, Maratona do Porto
- **Trail**: Ultra Trail Serra da Estrela, Trail do Mondego, Madeira Island Ultra Trail
- **HYROX**: HYROX Lisboa, HYROX Porto
- **CrossFit**: CrossFit Portuguese Championship, Battle of Boxes
- **OCR**: Spartan Race Lisboa, OCR Chaves Championship, Tough Mudder
- **BTT**: BTT Monsanto Challenge, Sintra MTB Race, Algarve Bike Challenge
- **Cycling**: Volta ao Algarve, Volta a Portugal, Granfondo Lisboa
- **Surf**: MEO Rip Curl Pro Portugal, Nazaré Tow Surfing Challenge
- **Triathlon**: Ironman Portugal, Triatlo de Lisboa, Challenge Lisboa

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Set environment variable:
   - `DATABASE_PG_URL`
4. Run database migrations in the Vercel dashboard
5. Deploy!

The app is Vercel-ready and optimized for production deployment.

## � Maintenance Mode

Athlifyr includes a built-in maintenance mode to safely perform updates or migrations.

### Quick Start

**Enable maintenance mode:**

```bash
# Using PowerShell (Windows)
.\scripts\maintenance.ps1 on

# Using Bash (Linux/Mac)
./scripts/maintenance.sh on
```

**Disable maintenance mode:**

```bash
# Using PowerShell (Windows)
.\scripts\maintenance.ps1 off

# Using Bash (Linux/Mac)
./scripts/maintenance.sh off
```

**Check status:**

```bash
# Using PowerShell (Windows)
.\scripts\maintenance.ps1 status

# Using Bash (Linux/Mac)
./scripts/maintenance.sh status
```

### Manual Setup

Add to your `.env` file:

```bash
# Enable maintenance mode
MAINTENANCE_MODE="true"

# Disable maintenance mode
MAINTENANCE_MODE="false"
```

**Important:** Remember to restart your application after changing the `.env` file.

For detailed documentation, see [docs/MAINTENANCE_MODE.md](docs/MAINTENANCE_MODE.md).

## �📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ for the Portuguese sports community
