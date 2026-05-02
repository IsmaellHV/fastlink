# FastLink Astro

Free, fast, privacy-friendly URL shortener. Astro 5 + React island + Cloudflare Turnstile.

Mirrors the FastLink feature from `portfolio-frontend-v1`, but:

- Server-rendered for **maximum SEO** (sitemap, JSON-LD, OG, canonical, semantic HTML).
- Single React island only on the form — landing page is zero-JS.
- **Basic auth credentials never leave the server** (proxied through `/api/shorten`).
- Tailwind v4 via `@tailwindcss/vite`.
- Standalone Node adapter for deployment anywhere.

## Stack

- Astro 5 (SSR via `@astrojs/node`)
- React 18 (only the form)
- Tailwind CSS 4
- `react-turnstile`
- TypeScript strict

## Development

```bash
cp .env.example .env       # then fill in real values
npm install
npm run dev                # http://localhost:4321
```

## Build & run

```bash
npm run build              # outputs dist/
node dist/server/entry.mjs # default Node standalone server
```

Or with PM2 / Docker / systemd as needed.

## Environment

| Variable                    | Side   | Notes                                      |
| --------------------------- | ------ | ------------------------------------------ |
| `PUBLIC_SITE_URL`           | public | Used for canonical, OG, sitemap            |
| `PUBLIC_TURNSTILE_SITE_KEY` | public | Cloudflare Turnstile site key              |
| `BACKEND_API_URL`           | server | e.g. `http://localhost:7001/api/PORTFOLIO` |
| `BACKEND_API_SCHEMA`        | server | `Utilitie`                                 |
| `BACKEND_API_ENTITY`        | server | `FastLink`                                 |
| `BACKEND_API_AUTH_BASIC`    | server | `user:password` (never exposed to client)  |

## Architecture

```
Browser ─POST /api/shorten──▶ Astro server endpoint
                                │
                                │ Basic auth (server-only)
                                ▼
                         Backend FastLink API
                         (createLink/{url}/{captcha})
```

The browser never sees `BACKEND_API_AUTH_BASIC`. The captcha token is forwarded
to the backend, which re-verifies it with Cloudflare's siteverify API.

## SEO checklist

- [x] Sitemap (`/sitemap-index.xml`) via `@astrojs/sitemap`
- [x] `robots.txt` allowing crawl, blocking `/api/`
- [x] `<title>` / `<meta description>` per page
- [x] Canonical URL per page
- [x] OpenGraph + Twitter card meta
- [x] JSON-LD `WebApplication` + `FAQPage` schema
- [x] Semantic HTML (`<header>`, `<main>`, `<footer>`, `<section>`, `<article>`)
- [x] Static-rendered hero + FAQ for crawlers
- [x] Single small React bundle hydrated only on the form
- [ ] Open Graph image (`/og-default.png` placeholder — add a real one)

## Deployment notes

- Behind Nginx/Caddy: terminate TLS, forward to Node on the chosen port.
- The standalone server listens on `HOST=0.0.0.0 PORT=4321` by default. Override
  via env.
- Set `PUBLIC_SITE_URL` to your real domain at build time so canonical/sitemap
  emit absolute URLs correctly.
