# ── Etapa 1: Builder ──────────────────────────────────────────────────────────
# Node 20 Alpine (imagen liviana) para compilar TypeScript a JavaScript.
FROM node:20-alpine AS builder

# OpenSSL es requerido por el motor de Prisma.
RUN apk add --no-cache openssl

WORKDIR /app

# Se copian primero los manifiestos y el schema para aprovechar la caché de capas.
COPY package*.json ./
COPY prisma ./prisma/

# Todas las dependencias (incluye devDependencies para poder compilar).
RUN npm install

# Cliente de Prisma a partir del schema.
RUN npx prisma generate

COPY . .

# Compila el servidor (src → dist) y el script de seed (prisma/seed.ts → dist/seed.js),
# para poder ejecutar ambos con node puro, sin ts-node en producción.
RUN npm run build \
 && npx tsc prisma/seed.ts --outDir dist --esModuleInterop --skipLibCheck --module commonjs --target ES2020 --resolveJsonModule

# ── Etapa 2: Runner ───────────────────────────────────────────────────────────
# Imagen final mínima, solo con lo necesario para ejecutar.
FROM node:20-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

# Solo dependencias de producción.
COPY package*.json ./
RUN npm install --omit=dev

# Cliente de Prisma generado + schema + migraciones.
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma/

# Código compilado (server.js + seed.js).
COPY --from=builder /app/dist ./dist

EXPOSE 3001

# Arranque: aplica migraciones, carga datos de prueba (seed idempotente por upsert)
# y levanta el servidor.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/seed.js && node dist/server.js"]
