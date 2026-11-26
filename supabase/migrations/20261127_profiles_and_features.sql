-- Profiles table linked to Supabase Auth users
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Feature flags table controlled by Admin
CREATE TABLE IF NOT EXISTS public.feature_flags (
  key text PRIMARY KEY,
  label text NOT NULL,
  label_bn text NOT NULL,
  description text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed default feature flags
INSERT INTO public.feature_flags (key, label, label_bn, description, enabled)
VALUES
  ('ai_partner', 'AI Partner Roleplay', 'AI পার্টনার রোলপ্লে', 'Interactive AI speaking conversations and roleplay scenarios.', true),
  ('spell_master', 'Spell Master', 'বানান মাস্টার', '55 spelling rules, 900+ words, audio dictation, and AI spelling coach.', true),
  ('challenge_90', '90-Day Spoken Challenge', '৯০-দিনের স্পোকেন চ্যালেঞ্জ', 'Guided 5-step daily spoken English challenge on Daily Practice.', true),
  ('grammar_checker', 'AI Grammar & Writing Checker', 'AI গ্রামার ও রাইটিং চেকার', 'Grammar and IELTS writing checker inside Grammar Path.', true),
  ('quiz', 'Level & Practice Quiz', 'লেভেল ও প্র্যাকটিস কুইজ', 'Assessment and practice quizzes.', true)
ON CONFLICT (key) DO NOTHING;

-- Helper function to check admin status safely without recursive RLS issues
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = uid AND role = 'admin' AND is_active = true
  );
$$;

-- Trigger to auto-create profile on Supabase Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email, ''), '@', 1)),
    'user',
    true
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Policies for feature_flags
DROP POLICY IF EXISTS "Anyone can read feature flags" ON public.feature_flags;
CREATE POLICY "Anyone can read feature flags"
  ON public.feature_flags FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can update feature flags" ON public.feature_flags;
CREATE POLICY "Admins can update feature flags"
  ON public.feature_flags FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
