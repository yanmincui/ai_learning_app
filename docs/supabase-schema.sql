create table if not exists public.course_days (
  day integer primary key check (day between 1 and 30),
  title text not null,
  module text not null,
  difficulty text not null,
  summary text not null,
  learning_objectives jsonb not null default '[]'::jsonb,
  concepts jsonb not null default '[]'::jsonb,
  deep_dives jsonb not null default '[]'::jsonb,
  tasks jsonb not null default '[]'::jsonb,
  assessments jsonb not null default '[]'::jsonb,
  references jsonb not null default '[]'::jsonb,
  recommended_books jsonb not null default '[]'::jsonb,
  project text not null,
  minutes integer not null default 60,
  created_at timestamptz not null default now()
);

create table if not exists public.news_items (
  id text primary key,
  title text not null,
  source text not null,
  url text not null unique,
  published_at timestamptz not null,
  category text not null check (category in ('模型发布', '工具平台', 'Agent/RAG', '行业应用', '安全政策', '开源生态')),
  summary text not null,
  impact_score integer not null check (impact_score between 0 and 100),
  created_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  user_id text not null,
  day integer not null check (day between 1 and 30),
  status text not null check (status in ('todo', 'doing', 'done')),
  quiz_score integer check (quiz_score between 0 and 100),
  wrong_question_ids jsonb not null default '[]'::jsonb,
  last_reviewed_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table if not exists public.news_runs (
  id bigserial primary key,
  status text not null,
  fetched_count integer not null default 0,
  inserted_count integer not null default 0,
  failed_sources jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.news_items enable row level security;
alter table public.user_progress enable row level security;
alter table public.news_runs enable row level security;

create policy "news is readable"
  on public.news_items for select
  using (true);

create policy "progress can be read by owner-like guest id"
  on public.user_progress for select
  using (true);

-- The app writes with SUPABASE_SERVICE_ROLE_KEY on the server.
