# HST Trading

A sourcing and inspection platform connecting China to Ivory Coast, helping Ivorian businesses import products from Chinese manufacturers.

## Live Site

**Production URL**: https://hst-trading-xi.vercel.app

## Tech Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS 3.4
- **Animation**: Motion (Framer Motion)
- **Routing**: React Router DOM 7
- **UI Components**: Radix UI + shadcn/ui
- **Backend**: InsForge (PostgreSQL + Auth + Realtime)
- **Testing**: Playwright
- **SEO**: react-helmet-async + vite-plugin-sitemap

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

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

## Features

- Landing page with services showcase
- User authentication (login/signup/verify)
- Client portal for creating sourcing requests
- Admin dashboard for managing requests and clients
- Real-time messaging between clients and admin
- Product trending page
- News/updates page
- SEO optimized with meta tags and sitemap

## Documentation

See [manual.md](./manual.md) for detailed technical documentation.

## License

Private - All rights reserved