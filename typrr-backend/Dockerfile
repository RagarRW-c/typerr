# ================================
# Stage 1 — Build
# ================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy prisma schema + migrations
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY src ./src

# Build TypeScript
RUN npx tsc


# ================================
# Stage 2 — Production
# ================================
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

# Install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled app
COPY --from=builder /app/dist ./dist

# Copy Prisma client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy prisma schema (needed for migrations)
COPY --from=builder /app/prisma ./prisma

EXPOSE 3003

CMD ["node", "dist/server.js"]