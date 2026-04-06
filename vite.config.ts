import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://hst-trading.vercel.app',
      generateRobotsTxt: true,
      dynamicRoutes: [
        '/',
        '/trends',
        '/news',
        '/auth/login',
        '/auth/signup',
        '/auth/verify',
        '/portal',
        '/portal/requests/new',
        '/admin',
        '/admin/requests',
        '/admin/clients',
        '/admin/messages',
        '/admin/trending',
        '/admin/news',
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
