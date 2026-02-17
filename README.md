# PDPrep - Salesforce PD1 Certification Prep

A web application for Salesforce Platform Developer 1 (PD1) certification exam preparation. Practice questions, progress tracking, and exam simulation.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | Supabase Auth |
| API | tRPC |
| Styling | Tailwind CSS |
| Testing | Vitest + React Testing Library |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Supabase account

### Installation

```bash
pnpm install
```

### Environment

Copy `.env.example` to `.env` and fill in:

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (from Supabase → Settings → Database)
DATABASE_URL="postgresql://postgres.xxx:password@aws-xxx.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
DIRECT_URL="postgresql://postgres.xxx:password@aws-xxx.pooler.supabase.com:5432/postgres?sslmode=require"

# Supabase (from Supabase → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

### Database Setup

```bash
# Push schema to database
pnpm prisma db push

# Seed with 222 PD1 questions
pnpm db:seed

# Generate Prisma client
pnpm db:generate
```

If your network blocks DB ports, use Supabase SQL Editor:
1. Run `supabase/schema.sql`
2. Run `supabase/seed.sql`

### Run the App

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing

```bash
# Watch mode
pnpm test

# Run once (CI)
pnpm test:run

# With coverage
pnpm test:coverage
```

## Project Structure

```
pdprep/
├── app/
│   ├── (marketing)/     # Landing page, about
│   ├── (auth)/          # Login, signup, callback
│   ├── (app)/           # Protected routes
│   │   ├── dashboard/   # Progress overview
│   │   ├── practice/    # Practice sessions
│   │   ├── exam/        # Mock exams
│   │   └── settings/    # User preferences
│   └── api/trpc/        # tRPC endpoint
├── components/ui/       # Button, Card, Input, Badge
├── lib/
│   ├── auth/            # Supabase client
│   ├── db/              # Prisma client
│   ├── trpc/            # tRPC routers
│   └── utils.ts         # Helpers
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seeds.js         # Seed script
├── tests/               # Vitest tests
├── data/seed/           # Question JSON files
└── styles/globals.css   # Design tokens
```

## Main Features

### Practice Flow

1. Select topic from `/practice`
2. Answer 10 questions per session
3. Get immediate feedback + explanation
4. View session score at the end
5. Progress tracked per topic

### Progress Tracking

- Questions attempted per topic
- Accuracy percentage
- Readiness score on dashboard

## API (tRPC)

### Practice

| Procedure | Description |
|-----------|-------------|
| `practice.getTopics` | Topics with user progress |
| `practice.getQuestions` | Questions for session |
| `practice.submitAnswer` | Submit & validate answer |

### Progress

| Procedure | Description |
|-----------|-------------|
| `progress.getOverview` | Overall stats |
| `progress.getReadinessScore` | Pass probability |

## Database Models

- **User** - Profile, preferences
- **Exam** - PD1 config (60 questions, 68% passing)
- **Topic** - 4 topics with weights
- **Question** - 222 practice questions
- **Answer** - Answer options
- **UserAnswer** - Submitted answers
- **UserProgress** - Per-topic stats

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm test` | Run tests (watch) |
| `pnpm test:run` | Run tests once |
| `pnpm lint` | ESLint |
| `pnpm type-check` | TypeScript check |
| `pnpm db:seed` | Seed database |
| `pnpm db:generate` | Generate Prisma client |

## Design System

Tokens in `styles/globals.css`:

- **Colors**: Warm neo-brutalist palette (terracotta, cream, charcoal)
- **Typography**: Georgia (headings), Inter (body), JetBrains Mono (code)
- **Components**: 2px borders, solid shadows, no border-radius
