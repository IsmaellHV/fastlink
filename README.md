<p align="center">
  <img src="public/favicon.svg" alt="FastLink logo" width="96" height="96" />
</p>

<h1 align="center">FastLink</h1>

<p align="center">
  Free, fast, privacy-friendly URL shortener.<br/>
  Paste a long link, get a short one. No account. No tracking pixels. No clutter.
</p>

<p align="center">
  🔗 <a href="https://ismaelhv.com/fastlink/">ismaelhv.com/fastlink</a> ·
  ✨ by <a href="https://ismaelhv.com">Ismael Hurtado</a>
</p>

---

## What it does

FastLink turns long, ugly URLs into short, shareable links — in one click, in
two languages (English / Español), in light or dark theme, and without asking
anything from you.

- 🪄 **One-step shortening.** Paste, pass the captcha, copy.
- 🔒 **Captcha-protected.** Cloudflare Turnstile keeps bots out so the service
  stays clean and free.
- 🚫 **No accounts, no tracking.** No login, no fingerprinting, no profile
  building. Aggregate counts only.
- 🌐 **Bilingual.** Every screen and microcopy localized in EN and ES, switch
  on the fly.
- 🌗 **Dark / light theme** with system-preference fallback and persistence.
- ♾️ **Links don't expire.** Once created, a short link works forever.

---

## Why it feels fast

- The landing, FAQ, about and meta are **fully server-rendered HTML**. The
  browser receives a finished page and starts painting immediately.
- The shortener form is a **single small interactive island**, hydrated only
  when needed.
- Static hashed assets, gzip on the proxy, prefetch on internal nav.

---

## Privacy by default

- **No cookies are written by the app itself.**
  Only `localStorage` for theme preference (`fastlink_theme`).
- **No tracking pixels, no analytics SDKs, no third-party fonts.**
- **Captcha tokens are single-use** and forwarded once to the backend, then
  discarded.
- **Backend credentials never reach the browser.** All calls to the
  shortening API go through a server endpoint that injects HTTP Basic auth at
  the edge.

```
Browser ─POST /api/shorten──▶ Server endpoint ──▶ Shortening API
                              (Basic auth here)
```

---

## Local development

```bash
cp .env.example .env       # fill in real values
npm install
npm run dev                # http://localhost:4321
```

### Environment

| Variable                    | Side   | Notes                                      |
| --------------------------- | ------ | ------------------------------------------ |
| `PUBLIC_SITE_URL`           | public | Canonical / OG / sitemap base URL          |
| `PUBLIC_BASE_PATH`          | public | URL prefix when served on a subpath        |
| `PUBLIC_TURNSTILE_SITE_KEY` | public | Cloudflare Turnstile site key              |
| `BACKEND_API_URL`           | server | Shortening API base URL                    |
| `BACKEND_API_SCHEMA`        | server | API schema segment                         |
| `BACKEND_API_ENTITY`        | server | API entity segment                         |
| `BACKEND_API_AUTH_BASIC`    | server | `user:password` — never exposed to client  |

`PUBLIC_*` values are inlined into the client bundle at **build time**;
everything else is read at runtime from the `.env` file mounted into the
container.

### Useful scripts

```bash
npm run dev          # dev server with HMR
npm run build        # type-check + production build
npm run preview      # preview the production build
npm run lint         # eslint
npm run format       # prettier
npm run typecheck    # astro check
```

---

## Production build & deploy

```bash
npm install
npm run build                 # generates dist/ with PUBLIC_* baked in
docker build -t fastlink .
docker run -p 80:80 --env-file .env fastlink
```

A ready-to-use `docker-compose.yml` is included with a frontend container and a
small reverse-proxy container, joined by a private network.

CI (GitHub Actions, `ci-production.yml`) handles format → lint → typecheck →
build → Docker image push when commits land on the `production` branch.

---

## Tech

- TypeScript end to end (`strict`)
- Server-rendered HTML with a single React island for the form
- Tailwind CSS for styling, mono-typography branding
- Cloudflare Turnstile for captcha
- Containerized for portable deployment behind Nginx / Caddy

---

## License

MIT © [ismaelhv](https://ismaelhv.com)
