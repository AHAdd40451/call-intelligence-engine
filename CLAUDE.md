# AI Call Intelligence & Content Engine — Build Brief

## Project
Next.js 14 App Router + TypeScript + Tailwind CSS + Supabase + Shadcn-style UI.

## Design Language
- Dark theme: bg-[#0a0a0f] primary, bg-[#111118] cards, bg-[#1a1a24] elevated
- Accent: #6366f1 (indigo), #8b5cf6 (violet), green for positive, red for negative
- Glass cards with border-[#ffffff10] and backdrop-blur
- Clean sidebar navigation, minimal and data-dense

## What to build (ALL files, working code only):

### 1. `/src/lib/supabase.ts` — Supabase client (browser + server)
### 2. `/src/lib/utils.ts` — cn() utility + formatters
### 3. `/src/lib/trellus.ts` — Trellus API client (ext.trellus.ai bootstrap + rpt-2.trellus.ai sessions)
### 4. `/src/types/index.ts` — All TypeScript interfaces

### 5. `/src/components/ui/` — UI primitives:
- button.tsx, card.tsx, badge.tsx, input.tsx, select.tsx, tabs.tsx, dialog.tsx, progress.tsx, skeleton.tsx, table.tsx, scroll-area.tsx, separator.tsx, tooltip.tsx, avatar.tsx

### 6. `/src/components/layout/`:
- Sidebar.tsx — nav with icons: Dashboard, Transcripts, Best Times, Coaching, Market Intel, Content Engine, Settings
- Header.tsx — top bar with search, notifications, user avatar
- DashboardLayout.tsx — wraps Sidebar + Header + main content

### 7. `/src/app/` pages:
- `layout.tsx` — root layout with ThemeProvider
- `page.tsx` — redirect to /dashboard
- `dashboard/page.tsx` — KPI overview: total calls, avg score, booking rate, top objection cards; recent calls table; mini charts
- `transcripts/page.tsx` — full transcript library with search + 7 filters
- `transcripts/[id]/page.tsx` — single transcript view with AI analysis panel
- `best-times/page.tsx` — heatmap grid (hour × day), conversion funnel cards
- `coaching/page.tsx` — setter leaderboard + individual scorer cards
- `coaching/[setterId]/page.tsx` — detailed setter breakdown
- `market-intelligence/page.tsx` — tag clouds, bar charts, trend sparklines
- `content-engine/page.tsx` — content ideas grid with type filter (Reel/Email/Podcast/FAQ/Copy)
- `settings/page.tsx` — API keys, sync settings

### 8. `/src/app/api/` routes:
- `sync/trellus/route.ts` — POST: pull from Trellus, upsert to Supabase
- `sync/ghl/route.ts` — POST: pull from GoHighLevel, upsert to Supabase
- `analyse/[callId]/route.ts` — POST: run Claude AI analysis on one call
- `analyse/batch/route.ts` — POST: queue batch analysis
- `content-engine/generate/route.ts` — POST: generate content ideas from recent transcripts
- `briefing/route.ts` — GET: morning executive briefing

### 9. `/supabase/migrations/001_initial_schema.sql` — Full schema:
```sql
-- calls table
-- ai_analysis table
-- pain_points, goals, objections (tag tables + junction)
-- content_ideas table
-- market_phrases table
-- faqs table
-- daily_briefings table
-- setters table
-- RLS policies
-- indexes
```

### 10. `/src/components/charts/`:
- HeatmapChart.tsx — recharts heatmap for best call times
- ScoreRadar.tsx — recharts radar for call scoring breakdown
- TrendLine.tsx — recharts area chart for weekly trends
- ObjectionBar.tsx — horizontal bar chart for objection frequency
- SentimentFlow.tsx — line chart tracking sentiment through call

### 11. `/src/components/features/`:
- CallCard.tsx — transcript library row card
- AIScoreBadge.tsx — coloured score ring 0–100
- TranscriptViewer.tsx — side-by-side transcript + AI analysis
- ContentIdeaCard.tsx — content engine idea card with type icon
- SetterCard.tsx — coaching leaderboard card
- MarketTagCloud.tsx — weighted tag cloud component
- MorningBriefing.tsx — executive briefing card

### 12. `/.env.example` — all required env vars documented
### 13. `/README.md` — setup instructions

## Key data models:
```typescript
interface Call {
  id: string
  lead_name: string
  phone: string
  setter: string
  setter_id: string
  date: string
  duration: number // seconds
  outcome: 'booked' | 'not_interested' | 'callback' | 'no_answer' | 'voicemail'
  recording_url?: string
  transcript?: string
  ai_summary?: string
  source: 'trellus' | 'ghl'
  raw_id: string
}

interface AIAnalysis {
  call_id: string
  overall_score: number
  rapport: number
  qualification: number
  discovery: number
  objection_handling: number
  urgency: number
  closing: number
  script_compliance: number
  communication: number
  buying_intent: 'very_high' | 'high' | 'medium' | 'low'
  buying_intent_reason: string
  pain_points: string[]
  goals: string[]
  objections: string[]
  sentiment: string[]
  missed_opportunities: string[]
  coaching_suggestions: string[]
}

interface ContentIdea {
  id: string
  type: 'instagram_reel' | 'email' | 'podcast' | 'webinar' | 'faq' | 'marketing_copy'
  title: string
  description: string
  source_call_ids: string[]
  created_at: string
  status: 'new' | 'reviewed' | 'used'
}
```

## Env vars needed:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- TRELLUS_API_KEY
- GHL_API_KEY
- ANTHROPIC_API_KEY (for AI analysis)
- CRON_SECRET (for scheduled jobs)

Build everything. Make it production-quality, dark themed, mobile-responsive.
