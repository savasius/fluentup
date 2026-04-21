-- FluentUp v2.3 — Education layer (lessons, progress, flashcards)
-- Run in Supabase SQL Editor after backing up if you have a legacy `lessons` table:
--   DROP TABLE IF EXISTS public.user_lesson_completions CASCADE;
--   DROP TABLE IF EXISTS public.lessons CASCADE;
-- Then run this file. (create table if not exists will skip if names conflict.)

-- Lessons table
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  cefr_level cefr_level not null,
  order_index int not null,
  intro_text text not null,
  word_slugs text[] not null default '{}',
  grammar_topic_slug text,
  grammar_tip text,
  grammar_examples text[] default '{}',
  quiz_questions jsonb not null default '[]'::jsonb,
  xp_reward int not null default 30,
  estimated_minutes int not null default 5,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists lessons_cefr_order_idx on public.lessons (cefr_level, order_index);
create index if not exists lessons_published_idx on public.lessons (published);

alter table public.lessons enable row level security;

drop policy if exists "Lessons are public" on public.lessons;
create policy "Lessons are public" on public.lessons
  for select using (published = true);

-- User lesson progress
create table if not exists public.user_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  lesson_slug text not null,
  status text not null check (status in ('in_progress', 'completed')),
  current_step int not null default 0,
  quiz_score int,
  quiz_total int,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, lesson_slug)
);

create index if not exists lesson_progress_user_idx on public.user_lesson_progress (user_id);
create index if not exists lesson_progress_user_completed_idx on public.user_lesson_progress (user_id, completed_at desc);

alter table public.user_lesson_progress enable row level security;

drop policy if exists "Users view own progress" on public.user_lesson_progress;
create policy "Users view own progress" on public.user_lesson_progress
  for select using (auth.uid() = user_id);

drop policy if exists "Users insert own progress" on public.user_lesson_progress;
create policy "Users insert own progress" on public.user_lesson_progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users update own progress" on public.user_lesson_progress;
create policy "Users update own progress" on public.user_lesson_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Flashcard reviews (spaced repetition)
create table if not exists public.flashcard_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  word_slug text not null,
  easiness real not null default 2.5,
  interval_days int not null default 0,
  repetitions int not null default 0,
  next_review_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, word_slug)
);

create index if not exists flashcard_next_review_idx on public.flashcard_reviews (user_id, next_review_at);

alter table public.flashcard_reviews enable row level security;

drop policy if exists "Users view own flashcards" on public.flashcard_reviews;
create policy "Users view own flashcards" on public.flashcard_reviews
  for select using (auth.uid() = user_id);

drop policy if exists "Users manage own flashcards" on public.flashcard_reviews;
create policy "Users insert own flashcards" on public.flashcard_reviews
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users update own flashcards" on public.flashcard_reviews;
create policy "Users update own flashcards" on public.flashcard_reviews
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users delete own flashcards" on public.flashcard_reviews;
create policy "Users delete own flashcards" on public.flashcard_reviews
  for delete using (auth.uid() = user_id);
