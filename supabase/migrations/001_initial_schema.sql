-- ============================================================================
-- AI Call Intelligence & Content Engine — initial schema
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- setters
-- ----------------------------------------------------------------------------
create table if not exists setters (
  id text primary key,
  name text not null,
  email text,
  avatar_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- calls
-- ----------------------------------------------------------------------------
create table if not exists calls (
  id text primary key,
  lead_name text not null,
  phone text not null,
  setter text not null,
  setter_id text references setters(id) on delete set null,
  date timestamptz not null,
  duration integer not null default 0,
  outcome text not null check (outcome in ('booked', 'not_interested', 'callback', 'no_answer', 'voicemail')),
  recording_url text,
  transcript text,
  ai_summary text,
  source text not null check (source in ('trellus', 'ghl')),
  raw_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (raw_id, source)
);

-- ----------------------------------------------------------------------------
-- ai_analysis
-- ----------------------------------------------------------------------------
create table if not exists ai_analysis (
  call_id text primary key references calls(id) on delete cascade,
  overall_score integer not null check (overall_score between 0 and 100),
  rapport integer not null check (rapport between 0 and 100),
  qualification integer not null check (qualification between 0 and 100),
  discovery integer not null check (discovery between 0 and 100),
  objection_handling integer not null check (objection_handling between 0 and 100),
  urgency integer not null check (urgency between 0 and 100),
  closing integer not null check (closing between 0 and 100),
  script_compliance integer not null check (script_compliance between 0 and 100),
  communication integer not null check (communication between 0 and 100),
  buying_intent text not null check (buying_intent in ('very_high', 'high', 'medium', 'low')),
  buying_intent_reason text not null default '',
  pain_points text[] not null default '{}',
  goals text[] not null default '{}',
  objections text[] not null default '{}',
  sentiment text[] not null default '{}',
  missed_opportunities text[] not null default '{}',
  coaching_suggestions text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- tag tables: pain_points, goals, objections (canonical labels + frequency)
-- ----------------------------------------------------------------------------
create table if not exists pain_points (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  frequency integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  frequency integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists objections (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  frequency integer not null default 0,
  created_at timestamptz not null default now()
);

-- junction tables linking calls to canonical tags
create table if not exists call_pain_points (
  call_id text not null references calls(id) on delete cascade,
  pain_point_id uuid not null references pain_points(id) on delete cascade,
  primary key (call_id, pain_point_id)
);

create table if not exists call_goals (
  call_id text not null references calls(id) on delete cascade,
  goal_id uuid not null references goals(id) on delete cascade,
  primary key (call_id, goal_id)
);

create table if not exists call_objections (
  call_id text not null references calls(id) on delete cascade,
  objection_id uuid not null references objections(id) on delete cascade,
  primary key (call_id, objection_id)
);

-- ----------------------------------------------------------------------------
-- content_ideas
-- ----------------------------------------------------------------------------
create table if not exists content_ideas (
  id text primary key default gen_random_uuid()::text,
  type text not null check (
    type in ('instagram_reel', 'email', 'podcast', 'webinar', 'faq', 'marketing_copy')
  ),
  title text not null,
  description text not null default '',
  source_call_ids text[] not null default '{}',
  status text not null default 'new' check (status in ('new', 'reviewed', 'used')),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- market_phrases
-- ----------------------------------------------------------------------------
create table if not exists market_phrases (
  id uuid primary key default gen_random_uuid(),
  phrase text not null,
  category text not null check (
    category in ('pain_point', 'goal', 'objection', 'sentiment', 'keyword')
  ),
  frequency integer not null default 1,
  call_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (phrase, category)
);

-- ----------------------------------------------------------------------------
-- faqs
-- ----------------------------------------------------------------------------
create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null default '',
  frequency integer not null default 1,
  source_call_ids text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- daily_briefings
-- ----------------------------------------------------------------------------
create table if not exists daily_briefings (
  id text primary key,
  date timestamptz not null,
  summary text not null default '',
  total_calls integer not null default 0,
  avg_score integer not null default 0,
  booking_rate numeric(5, 4) not null default 0,
  top_performer text,
  top_objection text,
  highlights text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Indexes
-- ============================================================================
create index if not exists idx_calls_date on calls (date desc);
create index if not exists idx_calls_setter_id on calls (setter_id);
create index if not exists idx_calls_outcome on calls (outcome);
create index if not exists idx_calls_source on calls (source);
create index if not exists idx_ai_analysis_overall_score on ai_analysis (overall_score);
create index if not exists idx_ai_analysis_buying_intent on ai_analysis (buying_intent);
create index if not exists idx_content_ideas_type on content_ideas (type);
create index if not exists idx_content_ideas_status on content_ideas (status);
create index if not exists idx_content_ideas_created_at on content_ideas (created_at desc);
create index if not exists idx_market_phrases_category on market_phrases (category);
create index if not exists idx_market_phrases_frequency on market_phrases (frequency desc);
create index if not exists idx_faqs_frequency on faqs (frequency desc);
create index if not exists idx_daily_briefings_date on daily_briefings (date desc);

-- ============================================================================
-- updated_at trigger for calls
-- ============================================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_calls_updated_at on calls;
create trigger trg_calls_updated_at
  before update on calls
  for each row
  execute function set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table setters enable row level security;
alter table calls enable row level security;
alter table ai_analysis enable row level security;
alter table pain_points enable row level security;
alter table goals enable row level security;
alter table objections enable row level security;
alter table call_pain_points enable row level security;
alter table call_goals enable row level security;
alter table call_objections enable row level security;
alter table content_ideas enable row level security;
alter table market_phrases enable row level security;
alter table faqs enable row level security;
alter table daily_briefings enable row level security;

-- Authenticated users can read everything. Writes happen exclusively via the
-- service role key from server-side API routes, so no insert/update/delete
-- policies are defined for the anon/authenticated roles.
create policy "Authenticated read access" on setters for select to authenticated using (true);
create policy "Authenticated read access" on calls for select to authenticated using (true);
create policy "Authenticated read access" on ai_analysis for select to authenticated using (true);
create policy "Authenticated read access" on pain_points for select to authenticated using (true);
create policy "Authenticated read access" on goals for select to authenticated using (true);
create policy "Authenticated read access" on objections for select to authenticated using (true);
create policy "Authenticated read access" on call_pain_points for select to authenticated using (true);
create policy "Authenticated read access" on call_goals for select to authenticated using (true);
create policy "Authenticated read access" on call_objections for select to authenticated using (true);
create policy "Authenticated read access" on content_ideas for select to authenticated using (true);
create policy "Authenticated read access" on market_phrases for select to authenticated using (true);
create policy "Authenticated read access" on faqs for select to authenticated using (true);
create policy "Authenticated read access" on daily_briefings for select to authenticated using (true);
