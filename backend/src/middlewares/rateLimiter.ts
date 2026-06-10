import rateLimit from 'express-rate-limit';

/* Limitadores de tasa por IP (EF3 — protección contra abuso y fuerza bruta).
   express-rate-limit cuenta las peticiones por ventana de tiempo y responde 429
   cuando se supera el límite. */

// Limitador general para toda la API (mitiga scraping y abuso).
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMIT', message: 'Demasiadas peticiones. Intenta nuevamente más tarde.' },
  },
});

// Limitador estricto para autenticación (anti fuerza bruta de contraseñas).
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMIT', message: 'Demasiados intentos de acceso. Espera unos minutos.' },
  },
});
