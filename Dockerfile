FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=80

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

COPY dist ./dist

EXPOSE 80

CMD ["node", "dist/server/entry.mjs"]
