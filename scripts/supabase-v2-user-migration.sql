-- FluentUp v2 — run manually in Supabase SQL editor (after backup).

alter table public.profiles
  add column if not exists mode text not null default 'adult'
    check (mode in ('adult', 'kid')),
  add column if not exists age integer,
  add column if not exists parent_email text,
  add column if not exists parent_consent boolean not null default false,
  add column if not exists parent_consent_at timestamptz,
  add column if not exists kid_interests text[];

alter table public.words
  add column if not exists translation_tr text,
  add column if not exists kid_safe boolean not null default true;

create index if not exists words_kid_safe_cefr_idx
  on public.words (kid_safe, cefr_level)
  where published = true;
