create table if not exists chat_feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  type text default 'chat_feedback',
  value text not null,
  content text,
  created_at timestamp with time zone default now()
);

alter table chat_feedback enable row level security;

create policy "Users can insert their own feedback"
on chat_feedback for insert
with check (auth.uid() = user_id);

create policy "Users can view their own feedback"
on chat_feedback for select
using (auth.uid() = user_id);
