# Etap 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Kopiuj pliki konfiguracyjne
COPY package*.json tsconfig.json ./

# WAŻNE: Kopiuj CAŁĄ zawartość prisma (wraz z migrations)
COPY prisma ./prisma/

# Instaluj zależności
RUN npm install

# Kopiuj kod źródłowy
COPY src ./src

# Generuj Prisma Client
RUN npx prisma generate

# Kompiluj TypeScript
RUN npx tsc

# Etap 2: Production
FROM node:22-alpine

WORKDIR /app

# Zainstaluj tylko production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Kopiuj skompilowany kod
COPY --from=builder /app/dist ./dist

# Kopiuj Prisma Client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Kopiuj CAŁĄ zawartość prisma (schema + migrations)
COPY --from=builder /app/prisma ./prisma

EXPOSE 3003

# Wykonaj migracje i uruchom serwer
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]