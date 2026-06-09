/**
 * cacheMiddleware.ts
 * ------------------
 * Caché en memoria (Map) con TTL configurable para respuestas GET.
 *
 * Úsalo en rutas de sólo lectura que se consultan frecuentemente pero
 * cuyos datos no cambian en cada petición (listados de animales, operativos…).
 *
 * Uso en una ruta:
 *   router.get('/', cache(30), getAnimales);          // TTL 30 s
 *   router.get('/', cache(60, 'animales'), getAnimales); // TTL 60 s + prefijo
 *
 * La clave de caché incluye la URL completa con query params, por lo que
 * ?estado=Disponible y ?estado=Adoptado tienen entradas independientes.
 *
 * El caché se invalida automáticamente al expirar el TTL.
 * Para invalida manualmente (p. ej. tras un POST/PATCH), usa invalidateCache().
 */

import { Request, Response, NextFunction } from 'express';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface CacheEntry {
  data: unknown;
  expiresAt: number; // timestamp en ms
}

// ─── Store global ─────────────────────────────────────────────────────────────

const store = new Map<string, CacheEntry>();

// Limpieza periódica de entradas expiradas (cada 5 min) para evitar memory leaks.
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.expiresAt <= now) store.delete(key);
  }
}, 5 * 60 * 1000);

// ─── Helpers públicos ─────────────────────────────────────────────────────────

/**
 * Elimina todas las entradas cuya clave empiece con `prefix`.
 * Llámalo en los handlers POST/PATCH/DELETE para mantener coherencia.
 *
 * Ejemplo:
 *   invalidateCache('animales'); // borra /api/animales, /api/animales?estado=…, etc.
 */
export function invalidateCache(prefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

/** Vacía el caché completo (útil en tests). */
export function clearCache(): void {
  store.clear();
}

/** Tamaño actual del caché (útil para métricas / health-check). */
export function cacheSize(): number {
  return store.size;
}

// ─── Middleware ───────────────────────────────────────────────────────────────

/**
 * @param ttlSeconds  Tiempo de vida en segundos (por defecto 30 s).
 * @param prefix      Prefijo de clave para poder invalidar por recurso.
 *                    Si se omite, se usa la URL base sin query params.
 */
export function cache(ttlSeconds = 30, prefix?: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Solo cachear GET
    if (req.method !== 'GET') { next(); return; }

    const keyPrefix = prefix ?? req.path.split('/')[1] ?? 'cache';
    const cacheKey  = `${keyPrefix}:${req.originalUrl}`;
    const now       = Date.now();

    const cached = store.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      // Hit: devuelve la respuesta cacheada con header informativo
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Cache-TTL', String(Math.round((cached.expiresAt - now) / 1000)));
      res.status(200).json(cached.data);
      return;
    }

    // Miss: intercepta res.json para guardar la respuesta en caché
    res.setHeader('X-Cache', 'MISS');

    const originalJson = res.json.bind(res);
    res.json = (body: unknown) => {
      // Solo cachear respuestas 2xx exitosas
      if (res.statusCode >= 200 && res.statusCode < 300) {
        store.set(cacheKey, {
          data: body,
          expiresAt: now + ttlSeconds * 1000,
        });
      }
      return originalJson(body);
    };

    next();
  };
}
