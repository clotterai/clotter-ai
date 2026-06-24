-- Clotter AI Memory System
-- Run this in the Supabase SQL Editor or via Supabase CLI

-- creator_profiles
create table if not exists public.creator_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade unique,
  name text,
  niche text,
  sub_niche text,
  audience_age text,
  audience_location text,
  audience_gender text,
  platforms text[] default '{}',
  content_style text,
  posting_frequency text,
  current_followers text,
  biggest_goal text,
  brand_name text,
  unique_angle text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- content_history
create table if not exists public.content_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content_type text not null check (
    content_type in ('idea', 'script', 'caption', 'hook', 'trend', 'chat')
  ),
  topic text,
  content_text text not null,
  platform text,
  created_at timestamptz not null default now()
);

create index if not exists content_history_user_id_created_at_idx
  on public.content_history (user_id, created_at desc);

-- user_preferences
create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade unique,
  likes text[] default '{}',
  dislikes text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists creator_profiles_updated_at on public.creator_profiles;
create trigger creator_profiles_updated_at
  before update on public.creator_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists user_preferences_updated_at on public.user_preferences;
create trigger user_preferences_updated_at
  before update on public.user_preferences
  for each row execute function public.set_updated_at();

-- RLS
alter table public.creator_profiles enable row level security;
alter table public.content_history enable row level security;
alter table public.user_preferences enable row level security;

drop policy if exists "Users manage own creator profile" on public.creator_profiles;
create policy "Users manage own creator profile"
  on public.creator_profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage own content history" on public.content_history;
create policy "Users manage own content history"
  on public.content_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage own preferences" on public.user_preferences;
create policy "Users manage own preferences"
  on public.user_preferences for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
