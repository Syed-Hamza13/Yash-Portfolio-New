-- =============================================
-- Yash Chourey Portfolio — Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===== PROFILES =====
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL DEFAULT 'Yash Chourey',
  title TEXT NOT NULL DEFAULT 'Graphic Designer',
  bio TEXT DEFAULT '',
  avatar_url TEXT,
  resume_url TEXT,
  location TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== SITE CONTENT (key-value for editable sections) =====
CREATE TABLE site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, key)
);

-- ===== CATEGORIES =====
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== PROJECTS =====
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT DEFAULT '',
  full_description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  cover_image TEXT,
  client TEXT,
  year TEXT,
  services TEXT,
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== PROJECT IMAGES =====
CREATE TABLE project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== EXPERIENCE =====
CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== EDUCATION =====
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== SKILLS =====
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  proficiency INTEGER DEFAULT 80 CHECK (proficiency >= 0 AND proficiency <= 100),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== SOCIAL LINKS =====
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== INDEXES =====
CREATE INDEX idx_projects_published ON projects(published, display_order);
CREATE INDEX idx_projects_category ON projects(category_id);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured = true;
CREATE INDEX idx_site_content_section ON site_content(section);
CREATE INDEX idx_categories_slug ON categories(slug);

-- ===== ROW LEVEL SECURITY =====

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ policies
CREATE POLICY "Public can read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public can read site_content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read published projects" ON projects FOR SELECT USING (published = true);
CREATE POLICY "Public can read project_images for published projects" ON project_images FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = project_images.project_id AND projects.published = true)
);
CREATE POLICY "Public can read experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Public can read education" ON education FOR SELECT USING (true);
CREATE POLICY "Public can read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public can read social_links" ON social_links FOR SELECT USING (true);

-- ADMIN policies (authenticated users can do everything)
CREATE POLICY "Admin full access profiles" ON profiles FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin full access site_content" ON site_content FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin full access projects" ON projects FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin full access project_images" ON project_images FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin full access experience" ON experience FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin full access education" ON education FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin full access skills" ON skills FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin full access social_links" ON social_links FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ===== STORAGE BUCKET =====
-- Run this in SQL editor or create via Supabase dashboard:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);

-- Storage RLS
-- CREATE POLICY "Public can read portfolio files" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
-- CREATE POLICY "Admin can upload portfolio files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');
-- CREATE POLICY "Admin can update portfolio files" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');
-- CREATE POLICY "Admin can delete portfolio files" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

-- ===== SEED DATA =====
-- Insert default profile
INSERT INTO profiles (full_name, title, bio, location, email) VALUES 
('Yash Chourey', 'Graphic Designer', 'I create visual identities, brand systems, and digital experiences that connect with people. With a focus on clean design and meaningful details, I help brands tell their story through thoughtful visual design.', 'India', 'hello@yashchourey.com');

-- Insert default site content
INSERT INTO site_content (section, key, value) VALUES
('hero', 'heading', 'Crafting Visual Stories'),
('hero', 'subheading', 'Graphic Designer & Brand Strategist'),
('hero', 'cta_text', 'View My Work'),
('hero', 'cta_link', '/work'),
('about', 'heading', 'About Me'),
('about', 'description', 'I''m Yash Chourey, a graphic designer passionate about creating visual experiences that leave a lasting impression. From brand identities to digital campaigns, I bring ideas to life through design that communicates, connects, and captivates.'),
('about', 'image', ''),
('contact', 'heading', 'Let''s Work Together'),
('contact', 'description', 'Have a project in mind? I''d love to hear about it. Let''s create something remarkable together.'),
('footer', 'text', '© 2024 Yash Chourey. All rights reserved.');

-- Insert default categories
INSERT INTO categories (name, slug, display_order) VALUES
('Logo Design', 'logo-design', 1),
('Branding', 'branding', 2),
('Social Media', 'social-media', 3),
('Thumbnails', 'thumbnails', 4),
('A+ Content', 'a-plus-content', 5),
('Banners', 'banners', 6);

-- Insert sample social links
INSERT INTO social_links (platform, url, display_order) VALUES
('Instagram', 'https://instagram.com/yashchourey', 1),
('Behance', 'https://behance.net/yashchourey', 2),
('LinkedIn', 'https://linkedin.com/in/yashchourey', 3),
('Dribbble', 'https://dribbble.com/yashchourey', 4);

-- ===== FUNCTIONS =====
-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content FOR EACH ROW EXECUTE FUNCTION update_updated_at();
