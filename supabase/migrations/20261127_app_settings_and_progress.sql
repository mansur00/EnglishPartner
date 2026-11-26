-- Global App Settings controlled by Admin (AI limits, Guest preview, System Notice)
CREATE TABLE IF NOT EXISTS public.app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.app_settings (key, value)
VALUES
  ('ai_daily_limit', '50'::jsonb),
  ('guest_preview_enabled', 'true'::jsonb),
  ('guest_preview_percent', '5'::jsonb),
  ('system_notice_enabled', 'false'::jsonb),
  ('system_notice', '""'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Per-user isolated progress synced to Supabase
CREATE TABLE IF NOT EXISTS public.user_app_state (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  state jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_app_state ENABLE ROW LEVEL SECURITY;

-- App settings: anyone can read, only admin can update
DROP POLICY IF EXISTS "Anyone can read app settings" ON public.app_settings;
CREATE POLICY "Anyone can read app settings"
  ON public.app_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can update app settings" ON public.app_settings;
CREATE POLICY "Admins can update app settings"
  ON public.app_settings FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert app settings" ON public.app_settings;
CREATE POLICY "Admins can insert app settings"
  ON public.app_settings FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- User app state: strictly isolated to the owning user
DROP POLICY IF EXISTS "Users can read own app state" ON public.user_app_state;
CREATE POLICY "Users can read own app state"
  ON public.user_app_state FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upsert own app state" ON public.user_app_state;
CREATE POLICY "Users can upsert own app state"
  ON public.user_app_state FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own app state" ON public.user_app_state;
CREATE POLICY "Users can update own app state"
  ON public.user_app_state FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
