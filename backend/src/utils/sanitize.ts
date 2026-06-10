/* Utilidades de sanitización de entradas (EF3 — seguridad avanzada).
   Defensa en profundidad contra XSS almacenado: aunque React escapa el contenido
   al renderizar, neutralizamos el HTML en el origen antes de persistir en la BD. */

/* Limpia un campo de texto libre proveniente del usuario:
   - elimina etiquetas HTML (evita inyección de <script>, <img onerror>, etc.)
   - elimina caracteres de control no imprimibles
   - recorta espacios y limita la longitud máxima. */
export const sanitizeText = (value: unknown, maxLength = 1000): string => {
  if (typeof value !== 'string') return '';
  const sinHtml = value.replace(/<[^>]*>/g, '');
  // Filtra caracteres de control (códigos 0-31 y 127) sin usar escapes frágiles.
  const limpio = Array.from(sinHtml)
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code > 31 && code !== 127;
    })
    .join('');
  return limpio.trim().slice(0, maxLength);
};

/* Variante para campos cortos (nombres, sectores, títulos). */
export const sanitizeShort = (value: unknown, maxLength = 120): string =>
  sanitizeText(value, maxLength);
