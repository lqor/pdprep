# pdprep

Scaffold for the PDPrep web app based on `PDPrep Specification (1).md`.

## Getting started

```bash
pnpm install
pnpm dev
```

## Environment

Copy `.env.example` to `.env` and fill in required credentials (Supabase, Stripe, database).

## Database

Prisma schema lives in `prisma/schema.prisma`. To generate the client after setting `DATABASE_URL`:

```bash
pnpm prisma generate
```

Seed sample data (requires a database connection):

```bash
pnpm db:seed
```

If your network blocks direct DB connections, you can apply the schema and seed via the
Supabase SQL editor instead:

1. Open **Supabase → SQL Editor**.
2. Run `supabase/schema.sql`.
3. Run `supabase/seed.sql`.

To regenerate `supabase/seed.sql` after updating the JSON question bank:

```bash
node scripts/generate-seed-sql.js
```

## Project layout

- `app/` - Next.js App Router routes
- `components/` - UI and shared components
- `styles/` - design tokens and global styles
- `lib/` - utilities

## Notes

- Design system tokens live in `styles/globals.css`.
- Marketing layout is under `app/(marketing)`; app shell under `app/(app)`.
