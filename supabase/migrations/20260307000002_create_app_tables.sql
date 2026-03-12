-- =============================================
-- Tunibless Database Schema
-- =============================================

-- 1. Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  thumbnail_url TEXT,
  author TEXT NOT NULL DEFAULT 'Admin',
  excerpt TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Animators / Presenters
CREATE TABLE IF NOT EXISTS public.animators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  role TEXT NOT NULL,
  is_online BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Contact Inquiries
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Radio Settings
CREATE TABLE IF NOT EXISTS public.radio_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stream_url TEXT NOT NULL DEFAULT 'https://stream.tunibless.fm/live',
  is_live BOOLEAN DEFAULT false,
  current_show TEXT,
  current_host TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Radio Schedule
CREATE TABLE IF NOT EXISTS public.radio_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  time_slot TEXT NOT NULL,
  show_name TEXT NOT NULL,
  host TEXT,
  is_current BOOLEAN DEFAULT false,
  day_of_week INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Success Stories (for public home page)
CREATE TABLE IF NOT EXISTS public.success_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  quote TEXT NOT NULL,
  role TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. User Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Row Level Security Policies
-- =============================================

-- Blog Posts: Public read, admin write
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published posts" ON public.blog_posts
  FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can do everything on posts" ON public.blog_posts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Animators: Public read, admin write
ALTER TABLE public.animators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read animators" ON public.animators FOR SELECT USING (true);
CREATE POLICY "Admins can manage animators" ON public.animators
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Contact Inquiries: Public insert, admin read/manage
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit inquiry" ON public.contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read inquiries" ON public.contact_inquiries
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can manage inquiries" ON public.contact_inquiries
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Radio Settings: Public read, admin write
ALTER TABLE public.radio_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read radio settings" ON public.radio_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage radio settings" ON public.radio_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Radio Schedule: Public read, admin write
ALTER TABLE public.radio_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read schedule" ON public.radio_schedule FOR SELECT USING (true);
CREATE POLICY "Admins can manage schedule" ON public.radio_schedule
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Success Stories: Public read, admin write
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read stories" ON public.success_stories FOR SELECT USING (true);
CREATE POLICY "Admins can manage stories" ON public.success_stories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Profiles: Users can read/update own, admins can read all
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- Auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- =============================================
-- Seed Data (matches original Stitch design)
-- =============================================

-- Seed blog posts
INSERT INTO public.blog_posts (title, category, status, author, thumbnail_url, excerpt) VALUES
  ('Top 10 Radio Hits 2024', 'Music', 'published', 'Admin', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA85ogQclrW8vplagEFlrCyhQLJ-59-9NPvvasx_BDhGzjkSEexyLf8UwuSyIocx3IcIrM74fPWx_lLBJRl8uFq6q-caoj3vd26-zdwBJhgv8h2Gs2Ka_NmEsFQC0iMKZDGqsEUhLKxBv-vYyydRLie7tIWlwn0CX9Hb5qFUlGMtCq2uiukPiNWZONWcvIQ41ooWx60GLDu1HXldstirf4B3KqwbwZ5TXUnAqffMghnE62zZSmDSZYKSdMM1kTe_TIOlwye0Rf0IhoU', 'Discover the chart-topping hits of 2024'),
  ('Inside the Studio: DJ Soul', 'Interview', 'draft', 'Sarah J.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0k1_CnoEfY3_EFQoM2PpVMY1cAjPyO6bnA-YXFNxhCvNmksoMDGJiJGqeqo5f_bOmQq6Yxz8U40RtBeVNdxivZQB3ctutDFjCq66xhRLvpE_eg8v0jizXTdNQTNAuzV1vylhZuA0ujyeCr1XEoIIUuc3fHpFOVtsyVsX3P5CC7TAlolpX-ufjgS2BOW4-c0Q6QLv9KlwZ3Ki50JfcRbzg5oj1c7Ruahrmrbf4bSnRNm1xSilxquAWIJZJqjO7oRMQF1dtKe39GS8L', 'An exclusive look behind the decks'),
  ('Broadcast Ethics 101', 'Training', 'published', 'Admin', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGGqnB2V0nZcdqz3Uia-HnGpAbqLLM7GSadFySJjIKFhe9_YVyPjOSMWLIH1Wq_cX_FqAlc9MaT2IzcDcg5v1C2UymSDDEJhG9lHRtGBKrqQlDAQkW39W7R7DY2YPtEd2dFxeDlaRrhw3t_203Qjv9nEPqCV9RcGBdG2jOSf2QfEeMoLgphw4ih6hc7GQU-RKwaot8inFi3wQMgDm1QWhysICtbfBq69W1fJb-ELXAF0sjcg_6XglaqCe0kIGXbHv8yxBDldT96g5i', 'Standards and best practices for radio');

-- Seed animators
INSERT INTO public.animators (name, initials, role, is_online) VALUES
  ('DJ Soul', 'DS', 'The Deep Dive Host', true),
  ('Sarah J.', 'SJ', 'Art News Presenter', false),
  ('Ahmed M.', 'AM', 'Morning Radio Host', true);

-- Seed contact inquiries
INSERT INTO public.contact_inquiries (name, initials, email, message) VALUES
  ('Marcus King', 'MK', 'marcus@example.com', 'Hi, I''m interested in advertising my brand on your afternoon radio show. Can I get a media kit?'),
  ('Elena Lopez', 'EL', 'elena@example.com', 'Great station! I was wondering if you could play some more underground house music in the evenings?');

-- Seed radio settings
INSERT INTO public.radio_settings (stream_url, is_live, current_show, current_host) VALUES
  ('https://stream.tunibless.fm/live', true, 'Tunibless Live Radio', 'Diaspora Voice');

-- Seed radio schedule
INSERT INTO public.radio_schedule (time_slot, show_name, host, is_current) VALUES
  ('08:00', 'Morning Coffee Mix', 'Sarah J.', false),
  ('10:00', 'Current Hits', 'Auto-Playlist', true),
  ('14:00', 'The Deep Dive', 'DJ Soul', false);

-- Seed success stories
INSERT INTO public.success_stories (name, title, quote, role, image_url) VALUES
  ('Ahmed', 'Ahmed''s Journey to IT Excellence', 'Tunibless helped me navigate the visa process and found me a mentor in Munich.', 'Software Engineer in Munich', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhgWFPP7o7Bag2Y71PSu6DakcUrVeX4js9gPNWiXT_0ON-kxXPdpHxn5Ta6rRTUykhVXzSL8gJeenGe-6ACvI5JaPdz6dYuup0Zr-yKM2gJsXYaRw9XCQTQmIkjX8aBwp0SWCXrgAvcQrx_ukowmxCDstq6xFeS2hDj1dVz27GyIzlqe19k2Cr6Gdffxi6u673CrC_Dj6tWQHVTcH8iuKWegWtcKf6MtNpHZpKzVEs_b-TgcuoTpk9UaPec_eHvdP5YuVH8BgJgdCo'),
  ('Sara', 'Sara''s Medical Specialization', 'The community network provided the emotional support I needed during my residency.', 'Medical Resident in Berlin', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDYudRvoBMyZ7JG2QGGqnal4vjq4CHFD6_qWejiDY1DtAhUm7a7z3wMNs-MXFofhIbQoQLkbn_bQ1BLXeNixQ0YZcJowvslGdJ5VM8FHySnCBSIwn_KJs9I5hbeFFF3VRz8VTDnRHxgqk2HGAsNGu9QAl1eGZnQovLb9r8gnDjxtZBM3LiJgBV9Nv2C6iwl52cIt9EyabZIRhZznZHWJCUqb7qpItK2gi2O8jTbCvjmUi5K-kY69ZLYudF61e5DyO7hTM1NvpR07vq'),
  ('Karim', 'Karim''s Entrepreneurial Leap', 'I went from a vocational student to launching my own startup in Hamburg.', 'Startup Founder in Hamburg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTvwA1lwGQb0OtqU-F-AsPK1Jqs8t3zY787rEHTWNBXmJYhBPP9UyivwqUrLGY_YFIb0STSrgYQupV0d-m5Y7sQQ95mviNWwgHCSbs5OCUe8rMznHnTXYTmftVLZ0oHekvnViwzt_lRKy7VK7F8mm8p6_jiiCjdPpBcII2LL8qUFqU6HU0yvslb7syV-gNDwocnq8Fq8o6Loh6X9Osvjei8aJQGhYa4oSnKpPabnPqcNOTNnxGtJ0tBgmztvOXkv0jV-v680r2RNCQ');
