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

## Project layout

- `app/` - Next.js App Router routes
- `components/` - UI and shared components
- `styles/` - design tokens and global styles
- `lib/` - utilities

## Notes

- Design system tokens live in `styles/globals.css`.
- Marketing layout is under `app/(marketing)`; app shell under `app/(app)`.
