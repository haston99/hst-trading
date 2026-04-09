# HST Trading - Technical Manual

## 1. Project Overview

**HST Trading** is a sourcing and inspection platform connecting China to Ivory Coast, helping Ivorian businesses import products from Chinese manufacturers.

### Business Model
- **Sourcing**: Clients request products they want to import
- **Inspection**: HST verifies product quality before shipping
- **Shipping**: Logistics from China to Ivory Coast ports

### Target Market
- Ivorian businesses and entrepreneurs
- Initially focused on Ivory Coast
- Potential expansion to West Africa

---

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS 3.4 |
| Animation | Motion (Framer Motion) |
| Routing | React Router DOM 7 |
| UI Components | Radix UI + shadcn/ui |
| Backend | InsForge (PostgreSQL + Auth + Realtime) |
| Testing | Playwright |
| SEO | react-helmet-async + vite-plugin-sitemap |

### Live URL
- **Production**: https://hst-trading-xi.vercel.app
- **Sitemap**: https://hst-trading-xi.vercel.app/sitemap.xml
- **Robots**: https://hst-trading-xi.vercel.app/robots.txt

### InsForge Details
- **Project ID**: `YOUR_PROJECT_ID`
- **Backend URL**: `https://YOUR_APP.us-east.insforge.app`
- **Anon Key**: `YOUR_ANON_KEY`

### Admin Account
- **Email**: `admin@yourdomain.com`
- **Password**: `YOUR_ADMIN_PASSWORD`

---

## 3. Project Structure

```
hst-trading/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components (Button, Input, Card, etc.)
│   │   ├── ProtectedRoute.tsx
│   │   └── AdminRoute.tsx
│   ├── hooks/
│   │   └── useAuth.tsx   # Authentication context
│   ├── lib/
│   │   ├── insforge.ts   # InsForge client setup
│   │   ├── api.ts        # API functions for all tables
│   │   ├── utils.ts      # Utility functions (cn for classnames)
│   │   └── setup-db.ts   # Database setup guide
│   ├── pages/
│   │   ├── Index.tsx     # Landing page
│   │   ├── TrendsPage.tsx
│   │   ├── NewsPage.tsx
│   │   ├── auth/         # Login, Signup, Verify
│   │   ├── portal/       # Client dashboard, requests
│   │   ├── admin/        # Admin dashboard, clients, messages
│   │   └── components/   # Landing page sections
│   ├── App.tsx          # Main routing
│   └── main.tsx         # Entry point
├── tests/
│   └── e2e/             # Playwright tests
├── index.html          # Entry HTML with SEO meta tags
├── vite.config.ts      # Vite config with sitemap plugin
├── SETUP.md            # Database setup instructions
├── manual.md           # This file
├── playwright.config.ts
└── package.json
```

---

## 4. Features

### Public Pages
- **Home** (`/`) - Landing page with hero, services, how it works, why us, products catalogue, contact
- **Nouveautés** (`/trends`) - New products showcase
- **Actualités** (`/news`) - News/updates feed
- **Login** (`/auth/login`)
- **Signup** (`/auth/signup`)
- **Verify** (`/auth/verify`) - Email verification

### Client Portal (Authenticated)
- **Dashboard** (`/portal`) - View all requests
- **New Request** (`/portal/requests/new`) - Create sourcing request
- **Request Detail** (`/portal/requests/:id`) - View request, quotes, chat

### Admin Panel (Admin Only)
- **Dashboard** (`/admin`) - Overview stats, recent activity
- **Requests** (`/admin/requests`) - All client requests
- **Request Detail** (`/admin/requests/:id`) - Create quotes, message client
- **Clients** (`/admin/clients`) - View all clients
- **Messages** (`/admin/messages`) - All conversations
- **Nouveautés** (`/admin/trending`) - Manage trending products
- **Actualités** (`/admin/news`) - Manage news posts

### Core Functionality
- User registration with email verification (6-digit code)
- Request creation with category, quantity, budget
- Multiple quotes per request
- Accept/reject quotes workflow
- Real-time chat between client and admin
- Activity logging for all actions

---

## 5. Database Schema

### Table: `users` (InsForge Auth)
Managed by InsForge authentication system.

### Table: `requests`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to users |
| title | text | Request title |
| category | text | Product category |
| description | text | Detailed description |
| quantity | integer | Order quantity |
| budget_per_unit | numeric | Max budget per unit |
| currency | text | EUR, USD, XOF, CNY |
| status | text | new, quoted, confirmed, in_production, inspecting, shipped, delivered |
| quoted_price | numeric | Accepted quote price |
| tracking_number | text | Shipping tracking |
| estimated_delivery | timestamptz | Expected delivery |
| admin_notes | text | Internal notes |
| client_notes | text | Client comments |
| created_at | timestamptz | Creation date |
| updated_at | timestamptz | Last update |

### Table: `messages`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| request_id | uuid | FK to requests |
| user_id | uuid | FK to users |
| content | text | Message text |
| sender_role | text | client or admin |
| created_at | timestamptz | Creation date |

### Table: `quotes`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| request_id | uuid | FK to requests |
| price_per_unit | numeric | Price per unit |
| currency | text | EUR, USD, XOF, CNY |
| notes | text | Quote details |
| status | text | pending, accepted, rejected |
| created_at | timestamptz | Creation date |
| updated_at | timestamptz | Last update |

### Table: `activity_logs`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| request_id | uuid | FK to requests |
| user_id | uuid | FK to users (nullable) |
| action | text | Action type |
| details | jsonb | Additional data |
| created_at | timestamptz | Creation date |

### Table: `trending_products`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Product name |
| description | text | Product description |
| image_url | text | Main image URL |
| image_url_2 | text | Second image URL |
| image_url_3 | text | Third image URL |
| image_url_4 | text | Fourth image URL |
| category | text | Product category |
| display_order | integer | Sort order |
| is_active | boolean | Show/hide |
| created_at | timestamptz | Creation date |

### Table: `news_posts`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Post title |
| content | text | Post content |
| category | text | new_arrivals, shipping, market |
| published_at | timestamptz | Publication date |
| is_active | boolean | Show/hide |
| created_at | timestamptz | Creation date |

---

## 6. API Functions (src/lib/api.ts)

### requestsApi
- `getAll()` - Get all requests
- `getByUserId(userId)` - Get requests by user
- `getById(id)` - Get single request
- `create(request)` - Create new request
- `updateStatus(id, status)` - Update request status
- `updateClientNotes(id, notes)` - Update client notes

### messagesApi
- `getByRequestId(requestId)` - Get messages for request
- `create(message)` - Send message

### quotesApi
- `getByRequestId(requestId)` - Get quotes for request
- `create(quote)` - Create new quote
- `updateStatus(id, status)` - Update quote status
- `acceptQuote(quoteId, requestId)` - Accept quote
- `rejectQuote(id)` - Reject quote

### activityLogsApi
- `getByRequestId(requestId)` - Get activity for request
- `create(log)` - Log activity

### trendingProductsApi
- `getAll()` - Get all products
- `getActive()` - Get active products
- `create(product)` - Add product
- `update(id, product)` - Update product
- `delete(id)` - Delete product

### newsPostsApi
- `getAll()` - Get all posts
- `getActive(limit)` - Get active posts
- `create(post)` - Create post
- `update(id, post)` - Update post
- `delete(id)` - Delete post

---

## 7. Running the Project

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
cd hst-trading
npm install
```

### Development
```bash
npm run dev
```
Opens at http://localhost:5173

### Build
```bash
npm run build
```
Output in `dist/` folder

### Testing
```bash
npm test           # Run all tests
npm run test:ui    # Run with interactive UI
npm run test:headed # Run with visible browser
```

---

## 8. Database Setup

### Create Tables
Run these SQL commands in InsForge dashboard:

```sql
-- Trending products (with 4 images)
CREATE TABLE trending_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_url_2 TEXT,
  image_url_3 TEXT,
  image_url_4 TEXT,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- News posts
CREATE TABLE news_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('new_arrivals', 'shipping', 'market')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Requests (if not exists)
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  quantity INTEGER,
  budget_per_unit NUMERIC,
  currency TEXT DEFAULT 'EUR',
  status TEXT DEFAULT 'new',
  quoted_price NUMERIC,
  tracking_number TEXT,
  estimated_delivery TIMESTAMPTZ,
  admin_notes TEXT,
  client_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL,
  user_id UUID,
  content TEXT NOT NULL,
  sender_role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotes
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL,
  price_per_unit NUMERIC NOT NULL,
  currency TEXT DEFAULT 'EUR',
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity logs
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID,
  user_id UUID,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Enable Row Level Security
```sql
-- Allow all operations for authenticated users
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "requests_all" ON requests FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_all" ON messages FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quotes_all" ON quotes FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_logs_all" ON activity_logs FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE trending_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trending_products_all" ON trending_products FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "news_posts_all" ON news_posts FOR ALL USING (true) WITH CHECK (true);
```

---

## 9. Deployment

### GitHub + Vercel (Current Setup)

1. **Push to GitHub**
   ```bash
   cd hst-trading
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/haston99/hst-trading.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository (hston99/hst-trading)
   - Vercel auto-detects Vite + React
   - Click Deploy

3. **Environment Variables**
   In Vercel project settings → Environment Variables:
   | Variable | Value |
   |----------|-------|
   | `VITE_INSFORGE_URL` | `https://rh4bwu85.us-east.insforge.app` |
   | `VITE_INSFORGE_ANON_KEY` | `ik_0f9631c409ff804dbd85a18add9ffe1f` |

4. **After adding env vars**: Redeploy to apply changes

### Backend (InsForge)
- Already configured
- Just ensure tables are created as per section 8

---

## 10. SEO Configuration

### Meta Tags
Each page has SEO meta tags using react-helmet-async:
- Title
- Meta description
- Open Graph tags (og:title, og:description, og:image)
- Canonical URLs
- Twitter Card tags

### Sitemap
- Auto-generated at build time by vite-plugin-sitemap
- Contains all public routes
- URL: `/sitemap.xml`

### Robots.txt
- Auto-generated at build time
- Allows all crawlers
- URL: `/robots.txt`

### Google Search Console
- Property: `https://hst-trading-xi.vercel.app`
- Verification: HTML meta tag in index.html
- Sitemap submitted: `sitemap.xml`

---

## 11. Environment Variables

The project uses the following environment variables:

```
VITE_INSFORGE_URL=https://rh4bwu85.us-east.insforge.app
VITE_INSFORGE_ANON_KEY=ik_0f9631c409ff804dbd85a18add9ffe1f
```

---

## 12. Troubleshooting

### Login not working
- Check InsForge credentials
- Verify email verification

### Database errors
- Ensure RLS policies are set
- Check anon key permissions

### Tests failing
- Ensure dev server is not running on port 5173
- Check browser installation: `npx playwright install`

### Build errors
- Run `npm run build` locally first to check for TypeScript errors

### Vercel deployment issues
- Check Build Settings: Framework Preset should be "Vite"
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

### SEO not working
- Verify sitemap at `/sitemap.xml`
- Check robots.txt at `/robots.txt`
- Ensure meta tags are in page source

---

## 13. Future Enhancements

- Email notifications
- Google Analytics integration
- Analytics dashboard
- PDF quote generation
- Payment integration
- Multi-language support (English)
- Custom domain (e.g., hst-trading.com)

---

## 14. Contact

For issues or questions, refer to:
- InsForge documentation: https://insforge.app/docs
- React Router documentation: https://reactrouter.com
- Playwright documentation: https://playwright.dev
- Vercel documentation: https://vercel.com/docs

---

*Last updated: April 2026*