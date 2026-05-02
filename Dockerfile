# ---------- builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps with cache-friendly layer
COPY package.json package-lock.json* ./
RUN npm ci

# Build
COPY . .
RUN npm run build

# ---------- runtime ----------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Only the production deps and the built output
COPY --from=builder /app/package.json /app/package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

EXPOSE 4321

# Astro Node standalone entry
CMD ["node", "dist/server/entry.mjs"]
