-- Planner calendar pins (AI output pinned from generators)
create table if not exists public.planner_pins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  pin_date date not null,
  pin_time time,
  content_type text not null,
  content_text text not null,
  created_at timestamptz not null default now()
);

create index if not exists planner_pins_user_date_idx
  on public.planner_pins (user_id, pin_date);

alter table public.planner_pins enable row level security;

drop policy if exists "Users manage own planner pins" on public.planner_pins;
create policy "Users manage own planner pins"
  on public.planner_pins for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
