# ---------------------------------------------------------------------------
# Stage 1: build the Vite bundle
# ---------------------------------------------------------------------------
FROM node:20-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite inlines env vars at build time, so these must arrive as build args.
# They point at the API as the *browser* sees it, not as the container sees it.
ARG VITE_API_BASE_URL=http://localhost:3000
ARG VITE_APP_API_BASE_URL=http://localhost:3000/api/v1
ARG VITE_STRIPE_PUBLISHABLE_KEY=

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_APP_API_BASE_URL=$VITE_APP_API_BASE_URL \
    VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

RUN npm run build

# ---------------------------------------------------------------------------
# Stage 2: serve the static bundle
# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
