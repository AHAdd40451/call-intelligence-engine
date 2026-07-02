# AI Call Intelligence & Content Engine

A dark-themed, data-dense dashboard for scoring sales calls with AI, coaching setters,
surfacing market intelligence, and generating content ideas from real transcripts.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase, and Shadcn-style
UI primitives.

## Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS, Radix UI primitives, Recharts
- **Database:** Supabase (Postgres + RLS)
- **AI:** Anthropic Claude (call scoring, coaching suggestions, content generation)
- **Data sources:** Trellus (dialer) and GoHighLevel (CRM)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key (browser-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only — bypasses RLS) |
| `TRELLUS_API_KEY` | API key from your Trellus workspace |
| `GHL_API_KEY` | GoHighLevel private integration / API key |
| `ANTHROPIC_API_KEY` | Anthropic API key used for call scoring & content generation |
| `CRON_SECRET` | Shared secret to authenticate scheduled cron requests |

### 3. Set up the database

Run the migration against your Supabase project (via the SQL editor, or the Supabase CLI):

```bash
supabase db push
# or paste supabase/migrations/001_initial_schema.sql into the Supabase SQL editor
```

This creates the `calls`, `ai_analysis`, `content_ideas`, `market_phrases`, `faqs`,
`daily_briefings`, `setters` tables (plus pain point/goal/objection tag tables), indexes,
and read-only RLS policies for authenticated users. All writes happen server-side through
the service role key.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/dashboard`.

> **Note:** Until Supabase is connected and synced, the UI renders from deterministic
> sample data in `src/lib/mock-data.ts` so every page is populated out of the box. Swap
> the mock calls in each page for real Supabase queries once your project is configured.

## Project Structure

```
src/
  app/                     # Routes (App Router)
    dashboard/             # KPI overview
    transcripts/           # Transcript library + detail view
    best-times/            # Call time heatmap + funnel
    coaching/               # Setter leaderboard + detail view
    market-intelligence/   # Tag cloud, objections, FAQs
    content-engine/        # AI-generated content ideas
    settings/               # API keys + sync controls
    api/
      sync/trellus/         # POST — pull Trellus sessions into Supabase
      sync/ghl/              # POST — pull GoHighLevel calls into Supabase
      analyse/[callId]/      # POST — score a single call with Claude
      analyse/batch/          # POST — queue analysis for unscored calls
      content-engine/generate/ # POST — generate content ideas from transcripts
      briefing/               # GET — compute + write the morning briefing
  components/
    ui/                     # Button, Card, Badge, Input, Select, Tabs, etc.
    layout/                 # Sidebar, Header, DashboardLayout
    charts/                 # Heatmap, Radar, TrendLine, ObjectionBar, SentimentFlow
    features/               # CallCard, AIScoreBadge, TranscriptViewer, etc.
  lib/
    supabase.ts             # Browser / server / service-role Supabase clients
    trellus.ts               # Trellus API client (bootstrap + reporting)
    anthropic.ts             # Minimal Claude Messages API client
    mock-data.ts             # Deterministic sample data for local development
    utils.ts                 # cn() + formatters
  types/index.ts             # Shared TypeScript interfaces
supabase/migrations/         # SQL schema
```

## Scheduled Jobs

Wire these routes up to a scheduler (Vercel Cron, GitHub Actions, etc.), authenticated
with `CRON_SECRET`:

- `POST /api/sync/trellus` and `POST /api/sync/ghl` — every 15 minutes
- `POST /api/analyse/batch` — hourly, to score any newly synced calls
- `GET /api/briefing` — daily each morning, to generate the executive briefing

## Deploy

Deploy on [Vercel](https://vercel.com/new) or any Node-compatible host. Set the
environment variables above in your hosting provider before the first deploy.
