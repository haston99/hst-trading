# Database Setup for Trending Products & News

## Step 1: Create Tables in InsForge Dashboard

Go to your InsForge dashboard and run the following SQL in the SQL editor:

```sql
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
```

## Step 2: Enable Access (Row Level Security)

Run these SQL commands to allow public read/write access:

```sql
-- Allow all operations on trending_products
ALTER TABLE trending_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trending_products_all" ON trending_products FOR ALL USING (true) WITH CHECK (true);

-- Allow all operations on news_posts
ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "news_posts_all" ON news_posts FOR ALL USING (true) WITH CHECK (true);
```

## Step 3: Insert Sample Data

Once tables are created, insert sample data:

```sql
-- Sample trending products
INSERT INTO trending_products (name, description, image_url, category, display_order) VALUES
('iPhone 15 Pro Max', 'Dernier smartphone Apple', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', 'Electronique', 1),
('MacBook Air M3', 'Ordinateur portable ultra-light', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 'Electronique', 2),
('Air Jordan 1', 'Sneakers iconiques', 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400', 'Mode', 3),
('Nike Dunk Low', 'Sneakers tendance', 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400', 'Mode', 4),
('Apple Watch Series 9', 'Montre connectee', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400', 'Electronique', 5),
('Casque AirPods Max', 'Audio haut de gamme', 'https://images.unsplash.com/photo-1625245488600-f03fef636a3c?w=400', 'Electronique', 6);

-- Sample news posts
INSERT INTO news_posts (title, content, category, published_at) VALUES
('Nouveaux produits Apple disponibles', 'Nous avons maintenant en stock les derniers produits Apple incluant iPhone 15 Pro Max, MacBook Air M3 et Apple Watch Series 9.', 'new_arrivals', NOW() - INTERVAL '2 days'),
('Delais de livraison mis a jour', 'En raison de la periode festive, les delais de livraison depuis la Chine sont actuellement de 25-35 jours.', 'shipping', NOW() - INTERVAL '5 days'),
('Tendance sneakers 2024', 'Les sneakers Nike et Jordan restent tres demandees cette annee. Les modeles Air Jordan 1 et Nike Dunk Low sont parmi les plus commandes.', 'market', NOW() - INTERVAL '1 week'),
('Reduction sur electronique', 'Profitez de nos meilleures offres sur electronique cette semaine. Remises speciales sur smartphones et accessories Apple.', 'market', NOW() - INTERVAL '3 days');
```

After running these SQL commands in your InsForge dashboard, the trending products and news sections will appear on your landing page.
