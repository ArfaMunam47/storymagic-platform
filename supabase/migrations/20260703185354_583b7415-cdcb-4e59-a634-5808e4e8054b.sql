
-- =========================================================
-- PROFILES
-- =========================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE USING (auth.uid() = id);

-- shared updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- auto-create profile row on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- CATEGORIES
-- =========================================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  emoji TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT USING (true);

INSERT INTO public.categories (slug, name, emoji) VALUES
  ('fantasy',   'Fantasy',   '🧚'),
  ('space',     'Space',     '🚀'),
  ('ocean',     'Ocean',     '🐠'),
  ('dinosaurs', 'Dinosaurs', '🦕'),
  ('adventure', 'Adventure', '🗺️'),
  ('animals',   'Animals',   '🦊');

-- =========================================================
-- STORIES
-- =========================================================
CREATE TABLE public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  cover_gradient TEXT NOT NULL DEFAULT 'from-magic-purple to-magic-pink',
  cover_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  min_age INT NOT NULL DEFAULT 3,
  max_age INT NOT NULL DEFAULT 10,
  featured BOOLEAN NOT NULL DEFAULT false,
  view_count INT NOT NULL DEFAULT 0,
  read_minutes INT NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.stories TO anon, authenticated;
GRANT ALL ON public.stories TO service_role;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stories are viewable by everyone"
  ON public.stories FOR SELECT USING (true);

CREATE INDEX idx_stories_category ON public.stories(category_id);
CREATE INDEX idx_stories_featured ON public.stories(featured) WHERE featured;
CREATE INDEX idx_stories_created ON public.stories(created_at DESC);

CREATE TRIGGER trg_stories_updated
  BEFORE UPDATE ON public.stories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed stories
INSERT INTO public.stories (title, description, cover_gradient, category_id, min_age, max_age, featured, view_count, read_minutes)
SELECT * FROM (VALUES
  ('Mira and the Glowing Forest', 'A brave girl discovers a forest that shines only for kind hearts.', 'from-magic-purple to-magic-pink', (SELECT id FROM public.categories WHERE slug='fantasy'),  4, 8, true,  1240, 6),
  ('Captain Leo''s Space Quest',   'Leo and his robot puppy race across the stars to save a lost moon.', 'from-magic-sky to-magic-purple',   (SELECT id FROM public.categories WHERE slug='space'),    5, 9, true,   980, 7),
  ('The Tiny Dragon''s Tea Party', 'A shy dragon hosts the coziest tea party in the whole valley.',     'from-magic-orange to-magic-pink',  (SELECT id FROM public.categories WHERE slug='adventure'),3, 7, false,  760, 5),
  ('Coral the Mermaid',            'Coral must find the singing pearl before the tide turns.',          'from-magic-sky to-magic-mint',     (SELECT id FROM public.categories WHERE slug='ocean'),    4, 9, true,   1520, 6),
  ('Bramble the Sleepy Bear',      'Bramble can''t sleep until every star says goodnight.',             'from-magic-yellow to-magic-orange',(SELECT id FROM public.categories WHERE slug='animals'),  3, 6, false,  430, 4),
  ('Rex the Kind Dinosaur',        'The biggest dinosaur in the valley has the smallest, warmest heart.','from-magic-mint to-magic-sky',    (SELECT id FROM public.categories WHERE slug='dinosaurs'),4, 8, false,  610, 5),
  ('The Cloud Whisperer',          'Ida can shape clouds — but one cloud has a secret of its own.',     'from-magic-sky to-magic-purple',   (SELECT id FROM public.categories WHERE slug='fantasy'),  5,10, false,  340, 6),
  ('Astro Bunny''s Moonwalk',      'A tiny bunny takes one giant hop across the moon.',                 'from-magic-purple to-magic-sky',   (SELECT id FROM public.categories WHERE slug='space'),    3, 6, false,  520, 4),
  ('The Reef Racers',              'Three seahorses train for the biggest reef race of the year.',      'from-magic-mint to-magic-sky',     (SELECT id FROM public.categories WHERE slug='ocean'),    5, 9, false,  290, 5),
  ('Nova and the Star Fox',        'A silver fox leads Nova home along a trail of falling stars.',      'from-magic-pink to-magic-purple',  (SELECT id FROM public.categories WHERE slug='adventure'),6,10, true,   870, 7)
) AS s;

-- =========================================================
-- FAVORITES
-- =========================================================
CREATE TABLE public.favorites (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, story_id)
);
GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own favorites"
  ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users add own favorites"
  ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users remove own favorites"
  ON public.favorites FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_favorites_user ON public.favorites(user_id);

-- =========================================================
-- READING HISTORY
-- =========================================================
CREATE TABLE public.reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  progress INT NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, story_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reading_history TO authenticated;
GRANT ALL ON public.reading_history TO service_role;
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own history"
  ON public.reading_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own history"
  ON public.reading_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own history"
  ON public.reading_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own history"
  ON public.reading_history FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_history_user_recent ON public.reading_history(user_id, last_read_at DESC);
