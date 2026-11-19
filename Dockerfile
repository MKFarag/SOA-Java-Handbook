# Multi-stage Dockerfile for Offline Java & Jakarta EE Handbook

# Stage 1: Build static assets
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependency definitions and install
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production Nginx static server (100% offline, ~25MB image)
FROM nginx:alpine AS runner

# Copy built static artifacts
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy optimized SPA nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
