ALTER TABLE public.creator_profiles
  ADD COLUMN IF NOT EXISTS avatar_url text;
