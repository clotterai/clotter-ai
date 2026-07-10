ALTER TABLE public.creator_profiles
  ADD COLUMN IF NOT EXISTS preferred_name text;
