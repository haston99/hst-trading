// Run these SQL commands in InsForge Dashboard to create tables:
/*
-- Create trending_products table
CREATE TABLE trending_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create news_posts table
CREATE TABLE news_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('new_arrivals', 'shipping', 'market')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and create policies
ALTER TABLE trending_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trending_products_all" ON trending_products FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "news_posts_all" ON news_posts FOR ALL USING (true) WITH CHECK (true);
*/
