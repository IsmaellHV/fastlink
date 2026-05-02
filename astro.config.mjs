// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

const SITE = process.env.PUBLIC_SITE_URL || 'https://ismaelhv.com';
const BASE = process.env.PUBLIC_BASE_PATH || '/fastlink';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [react(), sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es' } } })],
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: { prefetchAll: true },
  build: { inlineStylesheets: 'auto' },
});
