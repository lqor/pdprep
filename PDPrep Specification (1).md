# pdprep.com — Technical Specification

## Overview

**pdprep** is a web application for Salesforce Platform Developer 1 (PD1) and Platform Developer 2 (PD2) certification exam preparation. The platform provides practice questions, mock exams, progress tracking, and detailed explanations to help developers pass their certifications on the first attempt.


**Target Users:** Salesforce developers preparing for PD1 or PD2 certification exams.

**Core Value Proposition:** Focused, high-quality practice questions with detailed explanations, progress tracking, and exam simulation — built by developers who have passed these certifications.

---

## Design System

### Visual Style: "Warm Neo-Brutalism"

A fusion of neo-brutalist UI patterns with Anthropic-inspired warm color palette. The style balances bold, structured elements with approachable warmth.

### Color Palette

```css
:root {
  /* Primary */
  --color-primary: #D96C4E;           /* Terracotta — primary accent, CTAs */
  --color-primary-hover: #C55A3E;     /* Darker terracotta for hover states */
  
  /* Backgrounds */
  --color-bg-primary: #FAF6F1;        /* Warm cream — main background */
  --color-bg-secondary: #FFFFFF;      /* White — cards, inputs */
  --color-bg-dark: #2D2926;           /* Warm charcoal — dark sections */
  
  /* Text */
  --color-text-primary: #2D2926;      /* Warm charcoal — headings, body */
  --color-text-secondary: #5C5652;    /* Muted brown — secondary text */
  --color-text-muted: #8C8582;        /* Light brown — captions, hints */
  --color-text-inverse: #FAF6F1;      /* Cream — text on dark backgrounds */
  
  /* Accent Colors */
  --color-accent-yellow: #F5D547;     /* Yellow — highlights, step 01 */
  --color-accent-green: #8FB996;      /* Sage green — success, step 03 */
  --color-accent-purple: #A78BFA;     /* Soft purple — tertiary accent */
  
  /* Semantic */
  --color-success: #8FB996;           /* Correct answers */
  --color-success-bg: #E8F5E9;        /* Correct answer background */
  --color-error: #E57373;             /* Incorrect answers */
  --color-error-bg: #FFEBEE;          /* Incorrect answer background */
  --color-warning-bg: #FFF9E6;        /* Explanation boxes */
  
  /* Borders & Shadows */
  --color-border: #2D2926;            /* All borders */
  --color-shadow: #2D2926;            /* Default shadow color */
}
```

### Typography

```css
:root {
  /* Font Families */
  --font-serif: 'Georgia', 'Times New Roman', serif;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  
  /* Font Sizes */
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 15px;
  --text-lg: 17px;
  --text-xl: 18px;
  --text-2xl: 22px;
  --text-3xl: 24px;
  --text-4xl: 40px;
  --text-5xl: 44px;
  --text-6xl: 56px;
  
  /* Line Heights */
  --leading-tight: 1.1;
  --leading-snug: 1.3;
  --leading-normal: 1.6;
  --leading-relaxed: 1.7;
  
  /* Letter Spacing */
  --tracking-tight: -1px;
  --tracking-normal: 0;
  --tracking-wide: 1px;
}
```

**Typography Rules:**
- **Headings (h1-h3):** Serif font (`--font-serif`), normal weight (400), tight letter-spacing
- **Body text:** Sans-serif font (`--font-sans`), relaxed line-height
- **Code snippets:** Monospace font (`--font-mono`)
- **Labels/badges:** Sans-serif, bold weight (600-700), wide letter-spacing
- **Italic emphasis:** Used for accent phrases in headings (e.g., "on the first try")

### Spacing System

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 100px;
  --space-32: 120px;
}
```

### Neo-Brutalist Components

#### Borders
- All interactive elements have `2px solid var(--color-border)`
- No border-radius (sharp corners) except for specific UI elements like avatars

#### Shadows
- Default: `4px 4px 0 var(--color-shadow)`
- Hover: `6px 6px 0 [accent-color]` or `8px 8px 0 [accent-color]`
- Shadows are solid colors, no blur

#### Hover Interactions
All interactive elements implement:
```css
.interactive {
  transition: all 0.2s ease;
}

.interactive:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--color-accent);
}
```

#### Buttons

**Primary Button:**
```css
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: 2px solid var(--color-border);
  padding: 16px 28px;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: var(--text-base);
  box-shadow: 4px 4px 0 var(--color-shadow);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--color-shadow);
}
```

**Secondary Button:**
```css
.btn-secondary {
  background-color: var(--color-bg-dark);
  color: var(--color-text-inverse);
  border: 2px solid var(--color-border);
  padding: 10px 20px;
  box-shadow: 3px 3px 0 var(--color-primary);
}

.btn-secondary:hover {
  background-color: var(--color-primary);
  box-shadow: 4px 4px 0 var(--color-shadow);
  transform: translate(-1px, -1px);
}
```

#### Cards
```css
.card {
  background-color: var(--color-bg-secondary);
  border: 2px solid var(--color-border);
  box-shadow: 6px 6px 0 var(--color-shadow);
  padding: var(--space-8);
  transition: all 0.2s ease;
}

.card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0 var(--color-accent);
}
```

#### Badges/Pills
```css
.badge {
  display: inline-block;
  background-color: var(--color-accent-yellow);
  border: 2px solid var(--color-border);
  padding: 6px 14px;
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: var(--tracking-wide);
  box-shadow: 2px 2px 0 var(--color-shadow);
}
```

#### Form Inputs
```css
.input {
  background-color: var(--color-bg-secondary);
  border: 2px solid var(--color-border);
  padding: 14px 16px;
  font-family: var(--font-sans);
  font-size: var(--text-base);
  width: 100%;
  transition: all 0.15s ease;
}

.input:focus {
  outline: none;
  box-shadow: 4px 4px 0 var(--color-primary);
  transform: translate(-2px, -2px);
}
```

---

## Application Architecture

### Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | Next.js 14 (App Router) | Server components, excellent DX, Vercel deployment |
| **Styling** | Tailwind CSS + CSS Variables | Utility-first with design tokens |
| **State Management** | Zustand | Lightweight, simple API for client state |
| **Database** | PostgreSQL (Supabase) | Relational data, Row Level Security, real-time |
| **ORM** | Prisma | Type-safe queries, migrations, excellent DX |
| **Authentication** | Supabase Auth | Built-in, supports OAuth, magic links |
| **Payments** | Stripe | Industry standard, webhooks, subscription management |
| **Deployment** | Vercel | Seamless Next.js integration, edge functions |
| **Analytics** | PostHog | Privacy-focused, self-hostable, feature flags |
| **Email** | Resend | Modern API, React email templates |

### Project Structure

```
pdprep/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Public marketing pages
│   │   ├── page.tsx              # Landing page
│   │   ├── pricing/
│   │   └── about/
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── callback/             # OAuth callback
│   ├── (app)/                    # Protected application
│   │   ├── layout.tsx            # App shell with sidebar
│   │   ├── dashboard/
│   │   ├── practice/
│   │   │   ├── page.tsx          # Topic selection
│   │   │   └── [topicId]/
│   │   │       └── page.tsx      # Practice session
│   │   ├── exam/
│   │   │   ├── page.tsx          # Exam selection
│   │   │   ├── [examId]/
│   │   │   │   ├── page.tsx      # Exam in progress
│   │   │   │   └── results/
│   │   │   └── history/
│   │   ├── progress/
│   │   └── settings/
│   ├── api/                      # API routes
│   │   ├── webhooks/
│   │   │   └── stripe/
│   │   └── trpc/
│   └── layout.tsx                # Root layout
├── components/
│   ├── ui/                       # Design system components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── marketing/                # Landing page components
│   ├── practice/                 # Practice-specific components
│   │   ├── question-card.tsx
│   │   ├── answer-option.tsx
│   │   ├── explanation-box.tsx
│   │   └── progress-bar.tsx
│   ├── exam/                     # Exam-specific components
│   └── shared/                   # Shared components
│       ├── navbar.tsx
│       ├── sidebar.tsx
│       └── footer.tsx
├── lib/
│   ├── db/                       # Database utilities
│   │   ├── prisma.ts
│   │   └── queries/
│   ├── auth/                     # Auth utilities
│   ├── stripe/                   # Stripe utilities
│   ├── utils/                    # General utilities
│   └── constants/
├── hooks/                        # Custom React hooks
├── stores/                       # Zustand stores
├── types/                        # TypeScript types
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── styles/
│   └── globals.css               # Design tokens, base styles
└── emails/                       # React email templates
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────┐
│    User     │────<│  Subscription   │     │    Exam     │
└─────────────┘     └─────────────────┘     └─────────────┘
       │                                           │
       │            ┌─────────────────┐            │
       └───────────>│  UserProgress   │<───────────┘
                    └─────────────────┘
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Topic     │────<│  Question   │────<│   Answer    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           │
                    ┌──────┴──────┐
                    │             │
                    ▼             ▼
            ┌─────────────┐ ┌─────────────┐
            │UserAnswer   │ │ ExamAttempt │
            └─────────────┘ └─────────────┘
```

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ============================================
// USER & AUTHENTICATION
// ============================================

model User {
  id                String    @id @default(cuid())
  email             String    @unique
  name              String?
  avatarUrl         String?
  
  // Subscription
  stripeCustomerId  String?   @unique
  subscription      Subscription?
  
  // Preferences
  selectedExam      ExamType  @default(PD1)
  emailNotifications Boolean  @default(true)
  
  // Timestamps
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  lastActiveAt      DateTime  @default(now())
  
  // Relations
  progress          UserProgress[]
  answers           UserAnswer[]
  examAttempts      ExamAttempt[]
  
  @@index([email])
  @@index([stripeCustomerId])
}

model Subscription {
  id                    String    @id @default(cuid())
  userId                String    @unique
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Stripe
  stripeSubscriptionId  String    @unique
  stripePriceId         String
  
  // Status
  status                SubscriptionStatus
  plan                  PlanType
  
  // Billing period
  currentPeriodStart    DateTime
  currentPeriodEnd      DateTime
  cancelAtPeriodEnd     Boolean   @default(false)
  
  // Timestamps
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  @@index([stripeSubscriptionId])
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  INCOMPLETE
  INCOMPLETE_EXPIRED
  PAST_DUE
  TRIALING
  UNPAID
}

enum PlanType {
  FREE
  MONTHLY
  YEARLY
  LIFETIME
}

enum ExamType {
  PD1
  PD2
}

// ============================================
// CONTENT
// ============================================

model Exam {
  id          String    @id @default(cuid())
  type        ExamType
  name        String    // "Platform Developer 1"
  description String?
  
  // Exam configuration
  questionCount     Int       @default(60)
  passingScore      Int       @default(68)    // Percentage
  durationMinutes   Int       @default(105)
  
  // Status
  isActive    Boolean   @default(true)
  
  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  topics      Topic[]
  questions   Question[]
  attempts    ExamAttempt[]
  progress    UserProgress[]
  
  @@unique([type])
}

model Topic {
  id          String    @id @default(cuid())
  examId      String
  exam        Exam      @relation(fields: [examId], references: [id], onDelete: Cascade)
  
  name        String    // "Apex & Data Management"
  slug        String    // "apex-data-management"
  description String?
  
  // Exam weighting (percentage)
  weight      Int       // e.g., 25 means 25% of exam
  
  // Order for display
  sortOrder   Int       @default(0)
  
  // Status
  isActive    Boolean   @default(true)
  
  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  questions   Question[]
  progress    UserProgress[]
  
  @@unique([examId, slug])
  @@index([examId])
}

model Question {
  id          String    @id @default(cuid())
  examId      String
  exam        Exam      @relation(fields: [examId], references: [id], onDelete: Cascade)
  topicId     String
  topic       Topic     @relation(fields: [topicId], references: [id], onDelete: Cascade)
  
  // Question content
  content     String    // The question text (supports markdown)
  codeSnippet String?   // Optional code block
  
  // Question type
  type        QuestionType @default(SINGLE_CHOICE)
  
  // Difficulty (1-5)
  difficulty  Int       @default(3)
  
  // Explanation shown after answering
  explanation String    // Detailed explanation (supports markdown)
  
  // Reference to official documentation
  referenceUrl String?
  
  // Metadata
  isPremium   Boolean   @default(false)
  isActive    Boolean   @default(true)
  
  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  answers     Answer[]
  userAnswers UserAnswer[]
  examQuestions ExamAttemptQuestion[]
  
  @@index([examId])
  @@index([topicId])
  @@index([isPremium])
}

enum QuestionType {
  SINGLE_CHOICE    // One correct answer
  MULTIPLE_CHOICE  // Multiple correct answers
}

model Answer {
  id          String    @id @default(cuid())
  questionId  String
  question    Question  @relation(fields: [questionId], references: [id], onDelete: Cascade)
  
  content     String    // Answer text
  isCorrect   Boolean   @default(false)
  
  // Order for display
  sortOrder   Int       @default(0)
  
  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  userAnswers UserAnswerSelection[]
  
  @@index([questionId])
}

// ============================================
// USER PROGRESS & ANSWERS
// ============================================

model UserProgress {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  examId      String
  exam        Exam      @relation(fields: [examId], references: [id], onDelete: Cascade)
  topicId     String
  topic       Topic     @relation(fields: [topicId], references: [id], onDelete: Cascade)
  
  // Stats
  questionsAttempted  Int   @default(0)
  questionsCorrect    Int   @default(0)
  
  // Calculated on update
  accuracyPercentage  Float @default(0)
  
  // Timestamps
  lastPracticedAt     DateTime?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  @@unique([userId, examId, topicId])
  @@index([userId])
  @@index([examId])
}

model UserAnswer {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  questionId  String
  question    Question  @relation(fields: [questionId], references: [id], onDelete: Cascade)
  
  // Result
  isCorrect   Boolean
  
  // Time spent (seconds)
  timeSpent   Int?
  
  // Context
  context     AnswerContext @default(PRACTICE)
  examAttemptId String?
  
  // Timestamps
  answeredAt  DateTime  @default(now())
  
  // Relations
  selections  UserAnswerSelection[]
  
  @@index([userId])
  @@index([questionId])
  @@index([userId, questionId])
}

model UserAnswerSelection {
  id            String    @id @default(cuid())
  userAnswerId  String
  userAnswer    UserAnswer @relation(fields: [userAnswerId], references: [id], onDelete: Cascade)
  answerId      String
  answer        Answer    @relation(fields: [answerId], references: [id], onDelete: Cascade)
  
  @@unique([userAnswerId, answerId])
}

enum AnswerContext {
  PRACTICE
  EXAM
}

// ============================================
// MOCK EXAMS
// ============================================

model ExamAttempt {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  examId      String
  exam        Exam      @relation(fields: [examId], references: [id], onDelete: Cascade)
  
  // Configuration
  questionCount Int
  durationMinutes Int
  
  // Status
  status      ExamAttemptStatus @default(IN_PROGRESS)
  
  // Results (populated on completion)
  score       Int?      // Percentage
  passed      Boolean?
  
  // Timing
  startedAt   DateTime  @default(now())
  completedAt DateTime?
  
  // Questions
  questions   ExamAttemptQuestion[]
  
  @@index([userId])
  @@index([examId])
  @@index([userId, examId])
}

model ExamAttemptQuestion {
  id              String    @id @default(cuid())
  examAttemptId   String
  examAttempt     ExamAttempt @relation(fields: [examAttemptId], references: [id], onDelete: Cascade)
  questionId      String
  question        Question  @relation(fields: [questionId], references: [id], onDelete: Cascade)
  
  // Order in exam
  sortOrder       Int
  
  // Answer (null if not yet answered)
  userAnswerId    String?
  
  // Flagged for review
  isFlagged       Boolean   @default(false)
  
  @@unique([examAttemptId, questionId])
  @@index([examAttemptId])
}

enum ExamAttemptStatus {
  IN_PROGRESS
  COMPLETED
  ABANDONED
}
```

---

## Authentication Flow

### Supported Methods

1. **Email + Password** — Traditional signup/login
2. **Magic Link** — Passwordless email login
3. **OAuth** — Google, GitHub (optional)

### Auth Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Signup    │────>│  Confirm    │────>│  Dashboard  │
│    Page     │     │   Email     │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                    (Magic Link)
                           │
┌─────────────┐            │
│   Login     │────────────┘
│    Page     │
└─────────────┘
       │
       │ (OAuth)
       ▼
┌─────────────┐
│  /callback  │───────────────────────> Dashboard
└─────────────┘
```

### Protected Routes

All routes under `(app)/` require authentication. Implement via Next.js middleware:

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect app routes
  if (req.nextUrl.pathname.startsWith('/dashboard') || 
      req.nextUrl.pathname.startsWith('/practice') ||
      req.nextUrl.pathname.startsWith('/exam')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (req.nextUrl.pathname.startsWith('/login') || 
      req.nextUrl.pathname.startsWith('/signup')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/practice/:path*',
    '/exam/:path*',
    '/settings/:path*',
    '/login',
    '/signup',
  ],
}
```

---

## API Design

### tRPC Router Structure

```typescript
// lib/trpc/routers/_app.ts
import { router } from '../trpc'
import { userRouter } from './user'
import { questionRouter } from './question'
import { practiceRouter } from './practice'
import { examRouter } from './exam'
import { progressRouter } from './progress'
import { subscriptionRouter } from './subscription'

export const appRouter = router({
  user: userRouter,
  question: questionRouter,
  practice: practiceRouter,
  exam: examRouter,
  progress: progressRouter,
  subscription: subscriptionRouter,
})

export type AppRouter = typeof appRouter
```

### Key Procedures

#### Practice

```typescript
// lib/trpc/routers/practice.ts

export const practiceRouter = router({
  // Get questions for a practice session
  getQuestions: protectedProcedure
    .input(z.object({
      examType: z.enum(['PD1', 'PD2']),
      topicId: z.string().optional(),
      count: z.number().min(1).max(50).default(10),
      difficulty: z.number().min(1).max(5).optional(),
      excludeAnswered: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      // Returns array of questions with answers (shuffled)
    }),

  // Submit an answer
  submitAnswer: protectedProcedure
    .input(z.object({
      questionId: z.string(),
      selectedAnswerIds: z.array(z.string()),
      timeSpent: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Records answer, updates progress, returns correct answer + explanation
    }),
})
```

#### Exam

```typescript
// lib/trpc/routers/exam.ts

export const examRouter = router({
  // Start a new mock exam
  start: protectedProcedure
    .input(z.object({
      examType: z.enum(['PD1', 'PD2']),
    }))
    .mutation(async ({ ctx, input }) => {
      // Creates ExamAttempt, selects random questions weighted by topic
      // Returns examAttemptId and first question
    }),

  // Get current exam state
  getAttempt: protectedProcedure
    .input(z.object({
      examAttemptId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      // Returns exam attempt with questions, answers, time remaining
    }),

  // Submit answer during exam
  submitAnswer: protectedProcedure
    .input(z.object({
      examAttemptId: z.string(),
      questionId: z.string(),
      selectedAnswerIds: z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      // Records answer, does NOT reveal correct answer
    }),

  // Flag question for review
  flagQuestion: protectedProcedure
    .input(z.object({
      examAttemptId: z.string(),
      questionId: z.string(),
      isFlagged: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Toggles flag status
    }),

  // Complete exam
  complete: protectedProcedure
    .input(z.object({
      examAttemptId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Calculates score, marks as completed, returns results
    }),

  // Get exam history
  getHistory: protectedProcedure
    .input(z.object({
      examType: z.enum(['PD1', 'PD2']).optional(),
      limit: z.number().default(10),
    }))
    .query(async ({ ctx, input }) => {
      // Returns past exam attempts with scores
    }),
})
```

#### Progress

```typescript
// lib/trpc/routers/progress.ts

export const progressRouter = router({
  // Get overall progress
  getOverview: protectedProcedure
    .input(z.object({
      examType: z.enum(['PD1', 'PD2']),
    }))
    .query(async ({ ctx, input }) => {
      // Returns: total questions answered, accuracy, by-topic breakdown
    }),

  // Get topic-specific progress
  getTopicProgress: protectedProcedure
    .input(z.object({
      examType: z.enum(['PD1', 'PD2']),
      topicId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      // Returns: questions attempted, accuracy, weak areas
    }),

  // Get readiness score
  getReadinessScore: protectedProcedure
    .input(z.object({
      examType: z.enum(['PD1', 'PD2']),
    }))
    .query(async ({ ctx, input }) => {
      // Calculates estimated pass probability based on practice performance
    }),
})
```

---

## Subscription & Payments

### Plans

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0 | 50 questions per exam, basic progress tracking |
| **Monthly** | $19/mo | Unlimited questions, mock exams, detailed analytics |
| **Yearly** | $149/yr | Same as monthly, 2 months free |
| **Lifetime** | $299 once | Lifetime access to all features |

### Stripe Integration

#### Webhook Events

```typescript
// app/api/webhooks/stripe/route.ts

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
])

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')!
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  if (relevantEvents.has(event.type)) {
    switch (event.type) {
      case 'checkout.session.completed':
        // Create/update subscription in database
        break
      case 'customer.subscription.updated':
        // Update subscription status
        break
      case 'customer.subscription.deleted':
        // Mark subscription as canceled
        break
      case 'invoice.payment_failed':
        // Send payment failed email, update status
        break
    }
  }

  return new Response('OK', { status: 200 })
}
```

### Access Control

```typescript
// lib/auth/access.ts

export async function canAccessQuestion(
  userId: string, 
  questionId: string
): Promise<boolean> {
  const [user, question] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    }),
    prisma.question.findUnique({
      where: { id: questionId },
    }),
  ])

  if (!question) return false
  
  // Free questions are always accessible
  if (!question.isPremium) return true
  
  // Premium questions require active subscription
  if (!user?.subscription) return false
  
  return user.subscription.status === 'ACTIVE'
}

export async function canStartExam(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  })
  
  // Mock exams require active subscription
  if (!user?.subscription) return false
  return user.subscription.status === 'ACTIVE'
}
```

---

## Page Specifications

### Landing Page (`/`)

**Purpose:** Convert visitors to signups

**Sections:**
1. Hero — Headline, subheadline, primary CTA, quiz card mockup
2. Stats bar — Key metrics (questions, pass rate, users, rating)
3. How it works — 3-step process
4. Features — 4 feature cards
5. Pricing — 3 plan cards (Free, Monthly, Yearly)
6. FAQ — Accordion
7. Final CTA — Signup prompt
8. Footer

### Dashboard (`/dashboard`)

**Purpose:** Overview of progress and quick actions

**Components:**
- Welcome message with user name
- Exam selector (PD1/PD2 toggle)
- Readiness score gauge
- Topic progress cards (mini version)
- Recent activity feed
- Quick action buttons: "Continue Practice", "Start Mock Exam"
- Streak counter (days practiced)

### Practice Topic Selection (`/practice`)

**Purpose:** Choose what to practice

**Components:**
- Exam selector (if not already set)
- Topic cards grid showing:
  - Topic name
  - Exam weight percentage
  - User's accuracy for topic
  - Questions attempted / total
  - "Practice" button
- "Practice All Topics" option
- Filters: difficulty, unanswered only

### Practice Session (`/practice/[topicId]`)

**Purpose:** Answer questions and learn

**Components:**
- Progress bar (X of Y questions)
- Question card:
  - Question number and topic badge
  - Question text (markdown rendered)
  - Code snippet (if applicable, syntax highlighted)
  - Answer options (radio for single, checkbox for multiple)
  - Submit button
- After submission:
  - Correct/incorrect indicator
  - Explanation box
  - "Next Question" button
- Session summary on completion

### Mock Exam (`/exam/[examId]`)

**Purpose:** Simulate real exam conditions

**Components:**
- Timer (countdown)
- Question navigator (grid of numbers, colored by status)
- Question display (same as practice, but no immediate feedback)
- Flag for review toggle
- Previous/Next navigation
- Submit exam button (with confirmation)

### Exam Results (`/exam/[examId]/results`)

**Purpose:** Review exam performance

**Components:**
- Score display (percentage, pass/fail)
- Time taken
- Topic breakdown chart
- Question review list:
  - Correct/incorrect indicator
  - Your answer vs correct answer
  - Explanation (expandable)
- "Retake Exam" and "Practice Weak Areas" buttons

### Settings (`/settings`)

**Purpose:** Account and subscription management

**Tabs:**
- **Profile:** Name, email, avatar
- **Preferences:** Default exam, email notifications
- **Subscription:** Current plan, billing history, upgrade/cancel
- **Account:** Change password, delete account

---

## Performance Considerations

### Database Indexes

Critical indexes are defined in the Prisma schema. Additional considerations:

```sql
-- Composite index for fetching unanswered questions
CREATE INDEX idx_user_unanswered ON "UserAnswer" (user_id, question_id);

-- Index for question filtering
CREATE INDEX idx_question_filters ON "Question" (exam_id, topic_id, is_premium, is_active);
```

### Caching Strategy

| Data | Cache Location | TTL | Invalidation |
|------|---------------|-----|--------------|
| Question content | Edge (Vercel) | 1 hour | On update |
| User progress | Redis | 5 min | On answer submit |
| Exam topics | Edge | 24 hours | On admin update |
| Leaderboards | Redis | 15 min | Time-based |

### Query Optimization

```typescript
// Efficient question fetching with answer shuffling
const questions = await prisma.question.findMany({
  where: {
    examId: exam.id,
    topicId: topicId || undefined,
    isActive: true,
    isPremium: hasPremium ? undefined : false,
  },
  include: {
    answers: {
      select: {
        id: true,
        content: true,
        sortOrder: true,
      },
    },
    topic: {
      select: {
        name: true,
        slug: true,
      },
    },
  },
  take: count,
  orderBy: {
    // Random ordering in PostgreSQL
    id: 'asc', // Will be randomized in application layer
  },
})

// Shuffle answers for each question
return questions.map(q => ({
  ...q,
  answers: shuffleArray(q.answers),
}))
```

---

## Security Considerations

### Row Level Security (Supabase)

```sql
-- Users can only read/update their own data
CREATE POLICY "Users can view own data" ON "User"
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own data" ON "User"
  FOR UPDATE USING (auth.uid()::text = id);

-- Users can only access their own answers
CREATE POLICY "Users can view own answers" ON "UserAnswer"
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own answers" ON "UserAnswer"
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);
```

### Input Validation

All tRPC procedures use Zod schemas for input validation. Example:

```typescript
const submitAnswerSchema = z.object({
  questionId: z.string().cuid(),
  selectedAnswerIds: z.array(z.string().cuid()).min(1).max(10),
  timeSpent: z.number().int().positive().max(3600).optional(),
})
```

### Rate Limiting

```typescript
// lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
})

// Usage in tRPC middleware
const rateLimitMiddleware = t.middleware(async ({ ctx, next }) => {
  const { success } = await ratelimit.limit(ctx.userId)
  if (!success) {
    throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
  }
  return next()
})
```

---

## Deployment & Infrastructure

### Environment Variables

```bash
# .env.example

# App
NEXT_PUBLIC_APP_URL=https://pdprep.com

# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_PRICE_MONTHLY=price_xxx
STRIPE_PRICE_YEARLY=price_xxx
STRIPE_PRICE_LIFETIME=price_xxx

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# Email (Resend)
RESEND_API_KEY=re_xxx

# Analytics (PostHog)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "crons": [
    {
      "path": "/api/cron/daily-stats",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Future Considerations

### Phase 2 Features

- **Flashcards mode** — Spaced repetition for key concepts
- **Study groups** — Shared progress, leaderboards
- **AI explanations** — Claude-powered answer explanations
- **Mobile app** — React Native with shared business logic

### Scalability

- Move to dedicated PostgreSQL if Supabase limits reached
- Implement question CDN for static content
- Consider read replicas for heavy read traffic
- Implement background jobs with Inngest for async processing

---

## Appendix

### Exam Topic Weights (Official)

**Platform Developer 1:**
| Topic | Weight |
|-------|--------|
| Salesforce Fundamentals | 23% |
| Data Modeling and Management | 22% |
| Process Automation and Logic | 30% |
| User Interface | 25% |

**Platform Developer 2:**
| Topic | Weight |
|-------|--------|
| Apex & Data Management | 28% |
| Process Automation, Integration | 27% |
| User Interface | 20% |
| Testing, Debugging, Deployment | 25% |

### Question Import Format

```json
{
  "examType": "PD1",
  "topic": "process-automation-logic",
  "type": "SINGLE_CHOICE",
  "difficulty": 3,
  "content": "A developer needs to create a custom controller extension...",
  "codeSnippet": null,
  "explanation": "Controller extensions require a StandardController parameter...",
  "referenceUrl": "https://developer.salesforce.com/docs/...",
  "isPremium": false,
  "answers": [
    { "content": "public MyExtension(ApexPages.StandardController ctrl)", "isCorrect": true },
    { "content": "public MyExtension(SObject record)", "isCorrect": false },
    { "content": "public MyExtension()", "isCorrect": false },
    { "content": "public MyExtension(Id recordId)", "isCorrect": false }
  ]
}
```
