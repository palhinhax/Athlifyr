# Athlifyr

**one place. all sports.**

Athlifyr is a comprehensive sports platform for discovering events, managing venues, building workouts, and connecting with the sports community. From running and trail to HYROX, CrossFit, OCR, BTT, cycling, surf, triathlon, and more — across Portugal, Spain, and beyond.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) with TypeScript
- **Database:** PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [NextAuth.js v5](https://authjs.dev/) (credentials + Google OAuth)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/)
- **Internationalization:** [next-intl](https://next-intl-docs.vercel.app/) (6 languages)
- **Payments:** [Stripe Connect](https://stripe.com/connect)
- **Storage:** [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html)
- **Email:** [Resend](https://resend.com/)
- **Maps:** [Leaflet](https://leafletjs.com/) / [React Leaflet](https://react-leaflet.js.org/)
- **Charts:** [Recharts](https://recharts.org/)
- **Testing:** Jest + React Testing Library + Playwright (E2E)
- **CI/CD:** GitHub Actions + [semantic-release](https://semantic-release.gitbook.io/)
- **Hosting:** [Vercel](https://vercel.com/)
- **Analytics:** Google Analytics + Vercel Analytics & Speed Insights

## 🌍 Supported Languages

| Language              | Code | Locale |
| --------------------- | ---- | ------ |
| 🇬🇧 English            | `en` | en_US  |
| 🇵🇹 Portuguese (PT-PT) | `pt` | pt_PT  |
| 🇪🇸 Spanish            | `es` | es_ES  |
| 🇫🇷 French             | `fr` | fr_FR  |
| 🇩🇪 German             | `de` | de_DE  |
| 🇮🇹 Italian            | `it` | it_IT  |

## 📁 Project Structure

```
├── app/
│   ├── [locale]/                # Internationalized routes
│   │   ├── admin/               # Admin dashboard (users, events, venues, reports)
│   │   ├── auth/                # Authentication (signin, signup, forgot/reset password)
│   │   ├── chat/                # Real-time messaging
│   │   ├── events/              # Sports events discovery & details
│   │   ├── exercises/           # Exercise library
│   │   ├── feed/                # Social feed
│   │   ├── map/                 # Interactive events & venues map
│   │   ├── my-schedule/         # Personal schedule
│   │   ├── profile/             # User profile & performance tracking
│   │   ├── settings/            # User settings & notifications
│   │   ├── venues/              # Venues/gyms discovery & management
│   │   ├── workouts/            # Workout builder, runner & training plans
│   │   └── ...                  # Contact, legal, sports pages, etc.
│   ├── api/                     # REST API routes
│   └── promo/                   # Landing pages (CrossFit, Running, Community)
├── components/                  # React components (200+ files)
│   ├── ui/                      # shadcn/ui base components
│   ├── workout-runner/          # Workout execution engine
│   ├── wall-clock/              # Gym wall clock display
│   ├── wall-timer/              # Configurable timer (AMRAP, EMOM, TABATA, etc.)
│   ├── training-plans/          # Training plan management
│   ├── performance/             # Performance tracking (strength, running, HYROX)
│   ├── instagram/               # Instagram post generator (12+ templates)
│   ├── chat/                    # Chat system components
│   └── ...                      # Event, venue, workout, and shared components
├── hooks/                       # Custom React hooks
├── lib/                         # Utilities, auth, API clients, business logic
├── messages/                    # Translation files (6 languages × 17 namespaces)
├── prisma/
│   ├── schema.prisma            # Database schema (72 models)
│   ├── migrations/              # Migration history
│   └── seeds/                   # Database seed files (events, venues, exercises, workouts)
├── types/                       # TypeScript type definitions
├── __tests__/                   # Unit & integration tests
├── tests/                       # E2E tests (Playwright)
└── docs/                        # Technical documentation
```

## 🏁 Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/palhinhax/Athlifyr.git
   cd Athlifyr
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Required environment variables:

   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/athlifyr"
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."

   # Stripe (optional)
   STRIPE_SECRET_KEY="..."
   STRIPE_WEBHOOK_SECRET="..."

   # Backblaze B2 storage (optional)
   B2_APPLICATION_KEY_ID="..."
   B2_APPLICATION_KEY="..."
   B2_BUCKET_ID="..."

   # Resend email (optional)
   RESEND_API_KEY="..."

   # Google Analytics (optional)
   NEXT_PUBLIC_GA_MEASUREMENT_ID="..."
   ```

4. Run database migrations:

   ```bash
   pnpm db:migrate
   ```

5. Seed the database:

   ```bash
   pnpm db:seed
   ```

6. Start the development server:

   ```bash
   pnpm dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 📜 Available Scripts

| Command                   | Description                  |
| ------------------------- | ---------------------------- |
| `pnpm dev`                | Start development server     |
| `pnpm build`              | Build for production         |
| `pnpm start`              | Start production server      |
| `pnpm lint`               | Run ESLint                   |
| `pnpm format`             | Format code with Prettier    |
| `pnpm typecheck`          | Run TypeScript type checking |
| `pnpm test`               | Run unit tests (Jest)        |
| `pnpm test:watch`         | Run tests in watch mode      |
| `pnpm test:coverage`      | Run tests with coverage      |
| `pnpm test:e2e`           | Run E2E tests (Playwright)   |
| `pnpm test:e2e:ui`        | Run E2E tests with UI        |
| `pnpm db:migrate`         | Run database migrations      |
| `pnpm db:seed`            | Seed the database            |
| `pnpm db:seed:exercises`  | Seed exercises library       |
| `pnpm db:seed:test-users` | Seed test users              |
| `pnpm db:studio`          | Open Prisma Studio           |

## 🏃 Features

### 🎯 Sports Events

- **Event discovery** with filters by sport, date, distance, and location
- **Interactive map** with event markers (Leaflet)
- **Event calendar** with month/week views
- **Event details** with variants, pricing phases, FAQs, and weather forecast
- **Event registration** tracking and participation history
- **Event results** for race finishers
- **Comments** and community discussion on events
- **Event weather** updates (automated via cron)
- **Multilingual event content** (titles, descriptions translated in 6 languages)
- **SEO optimized** with structured data (JSON-LD), sitemap, and meta tags

### 🏋️ Workout Builder & Runner

- **Workout builder** with block-based structure (WARMUP, STRENGTH, AMRAP, EMOM, FOR_TIME, TABATA, CHIPPER, REST, COOLDOWN, SKILL)
- **Exercise library** with 200+ exercises, translated in 6 languages
- **Workout runner** with real-time timer, audio alerts, and lap tracking
- **Wall clock & timer** for gym displays (7-segment LCD style)
- **Workout logging** with actual weights, reps, and perceived effort (RPE)
- **Personal records** (PR) detection and tracking
- **Public workout library** — discover and save community workouts
- **Instagram-style preview** — export workouts as square (1:1) images for social media
- **Assign workouts to sessions** — coaches can publish workouts to classes

### 📋 Training Plans

- **Multi-week training plans** with day-by-day workout scheduling
- **Plan assignment** — coaches assign plans to athletes
- **Public plans** — discover and save community training plans
- **Plan progress tracking** for assigned athletes

### 📊 Performance Tracking

- **Strength tracking** — log exercises, track 1RM progress with charts
- **Running tracking** — log runs with distance, time, pace
- **HYROX tracking** — full HYROX race results with segment breakdowns
- **Trail tracking** — elevation gain, terrain data
- **Performance charts** with historical trends (Recharts)

### 🏢 Venue Management

- **Venue profiles** with gallery, description, location, and services
- **Session scheduling** — recurring and one-off sessions/classes
- **Booking system** with capacity limits, waitlist, and cancellation policies
- **Subscription plans** with flexible policies (day limits, time restrictions, venue groups)
- **Stripe Connect** payments for venue owners
- **Staff management** — roles (Owner, Admin, Coach, Athlete)
- **Team invites** via email with role assignment
- **Venue reviews** and recommendations
- **Venue SEO settings** with custom meta titles and descriptions
- **Ownership claims** — claim and verify venue ownership
- **Easy booking** — quick booking flow for members

### 👥 Social & Community

- **Social feed** — create posts with images, likes, and comments
- **Friends system** — send/accept friend requests
- **Chat system** — real-time direct messaging
- **User profiles** with photo gallery, performance stats, and activity
- **Friend attendance** — see which friends are going to events
- **User blocking and reporting**

### 🛡️ Admin Dashboard

- **User management** — roles, bans, account details
- **Event management** — create, edit, manage translations
- **Venue management** — approval, ownership, commission settings
- **Exercise management** — CRUD with translations
- **Contact management** — view and reply to contact form submissions
- **User reports** — review and moderate reported content
- **Media management** — uploaded files overview
- **Instagram post generator** — 12+ templates for social media content

### 🔐 Authentication & Security

- **Credentials auth** — email/password with bcrypt
- **Google OAuth** integration
- **Email verification** with token-based flow
- **Password reset** via email
- **Role-based access** — User, Admin
- **Venue role-based permissions** — Owner, Admin, Coach, Athlete

### 🌐 Internationalization (i18n)

- **6 languages** fully supported: EN, PT (European), ES, FR, DE, IT
- **17 translation namespaces** (admin, auth, chat, common, events, exercises, feed, home, legal, navigation, performance, presentation, schedule, sports, timer, venues, workouts)
- **Locale-aware routing** — `/pt/events`, `/en/events`, etc.
- **European Portuguese** (pt-PT) — never Brazilian Portuguese

### 📈 SEO & Marketing

- **Structured data** (JSON-LD) for events, venues, and pages
- **Dynamic sitemap** and robots.txt
- **Meta tags** with Open Graph and Twitter Cards
- **Promotional landing pages** (CrossFit, Running, Community)
- **Google Analytics** + Vercel Analytics & Speed Insights

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set environment variables (see `.env.example`)
4. Run database migrations:
   ```bash
   pnpm db:migrate:deploy
   ```
5. Deploy!

The app uses automated releases via **semantic-release** with [Conventional Commits](https://www.conventionalcommits.org/).

## 🛠 Maintenance Mode

Athlifyr includes a built-in maintenance mode for safe deployments.

Add to your `.env` file:

```bash
MAINTENANCE_MODE="true"    # Enable
MAINTENANCE_MODE="false"   # Disable
```

For detailed documentation, see [docs/MAINTENANCE_MODE.md](docs/MAINTENANCE_MODE.md).

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:

| Document                                                  | Description                    |
| --------------------------------------------------------- | ------------------------------ |
| [VENUES_IMPLEMENTATION.md](docs/VENUES_IMPLEMENTATION.md) | Venue system architecture      |
| [TRAINING_PLANS.md](docs/TRAINING_PLANS.md)               | Training plans system          |
| [CHAT_SYSTEM.md](docs/CHAT_SYSTEM.md)                     | Chat implementation            |
| [EXERCISES_SYSTEM.md](docs/EXERCISES_SYSTEM.md)           | Exercise library               |
| [WEATHER_SYSTEM.md](docs/WEATHER_SYSTEM.md)               | Weather forecasts              |
| [SEO.md](docs/SEO.md)                                     | SEO strategy & structured data |
| [I18N_SETUP.md](docs/I18N_SETUP.md)                       | Internationalization setup     |
| [INSTAGRAM_GENERATOR.md](docs/INSTAGRAM_GENERATOR.md)     | Instagram post generator       |
| [ANALYTICS_EVENTS.md](docs/ANALYTICS_EVENTS.md)           | Analytics event tracking       |
| [MAINTENANCE_MODE.md](docs/MAINTENANCE_MODE.md)           | Maintenance mode               |
| [GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md)       | Google OAuth setup             |
| [BACKBLAZE_SETUP.md](docs/BACKBLAZE_SETUP.md)             | File storage setup             |
| [RESEND_SETUP.md](docs/RESEND_SETUP.md)                   | Email provider setup           |
| [PALETTE.md](docs/PALETTE.md)                             | Design system & color palette  |

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

Built with ❤️ for the sports community
