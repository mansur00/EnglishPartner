ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_active_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS disabled_features jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Allow authenticated users to update their own last_active_at heartbeat
DROP POLICY IF EXISTS "Users can update own last_active_at" ON public.profiles;
CREATE POLICY "Users can update own last_active_at"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
