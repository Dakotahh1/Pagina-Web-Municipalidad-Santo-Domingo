# ── Etapa 1: Builder ──────────────────────────────────────────────────────────
# Usamos Node 20 Alpine (imagen liviana) para compilar TypeScript
FROM node:20-alpine AS builder

# Instalar dependencias del sistema necesarias para bcryptjs y Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copiar archivos de dependencias primero (aprovecha caché de Docker)
COPY package*.json ./
COPY prisma ./prisma/

# Instalar TODAS las dependencias (incluyendo devDependencies para compilar)
RUN npm install

# Generar el cliente de Prisma
RUN npx prisma generate

# Copiar el resto del código fuente
COPY . .

# Compilar TypeScript a JavaScript
RUN npm run build

# ── Etapa 2: Runner ───────────────────────────────────────────────────────────
# Imagen final más liviana, solo con lo necesario para correr
FROM node:20-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

# Copiar solo dependencias de producción
COPY package*.json ./
RUN npm install --omit=dev

# Copiar el cliente de Prisma generado y el schema
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma/

# Copiar el código compilado
COPY --from=builder /app/dist ./dist

# Exponer el puerto del backend
EXPOSE 3001

# Script de inicio: ejecuta migraciones y luego levanta el servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
