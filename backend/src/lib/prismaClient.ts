import { PrismaClient } from '@prisma/client';

// ─────────────────────────────────────────────────────────────────────────────
// PRISMA CLIENT SINGLETON
// En desarrollo, Next.js y ts-node-dev recargan módulos frecuentemente.
// Sin este patrón, se crearían demasiadas conexiones a la BD.
// ─────────────────────────────────────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export default prisma;
