/**
 * cloudinaryService.ts
 * ──────────────────────
 * Integración con Cloudinary (API de terceros) para almacenamiento de
 * imágenes de animales y fotos de reportes.
 *
 * ESTRATEGIA: Subida directa desde el frontend (signed upload)
 * ──────────────────────────────────────────────────────────────
 * El backend NUNCA recibe el archivo binario. En su lugar:
 *
 * 1. El frontend pide al backend una "firma" (signature) para un upload.
 * 2. El backend genera esa firma usando el API_SECRET (que nunca se expone
 *    al cliente) y la devuelve junto con los datos públicos necesarios.
 * 3. El frontend sube el archivo DIRECTO a Cloudinary usando esa firma.
 * 4. Cloudinary devuelve la URL pública de la imagen al frontend.
 * 5. El frontend manda esa URL al backend para guardarla en la BD
 *    (campo `imagenes` de Mascota o `fotos` de Reporte).
 *
 * Ventajas:
 * - El servidor no carga con el peso de los archivos (más rápido, menos memoria).
 * - Cloudinary optimiza/transforma las imágenes automáticamente.
 * - El API_SECRET nunca viaja al cliente.
 *
 * Variables de entorno requeridas (.env):
 *   CLOUDINARY_CLOUD_NAME=tu_cloud_name
 *   CLOUDINARY_API_KEY=tu_api_key
 *   CLOUDINARY_API_SECRET=tu_api_secret
 *
 * Cómo obtenerlas: https://cloudinary.com/users/register/free
 *   → Dashboard → Product Environment Credentials
 */

import crypto from 'crypto';

const CLOUD_NAME  = process.env.CLOUDINARY_CLOUD_NAME ?? '';
const API_KEY     = process.env.CLOUDINARY_API_KEY ?? '';
const API_SECRET  = process.env.CLOUDINARY_API_SECRET ?? '';

// ─── Validación de configuración ───────────────────────────────────────────────

export function isCloudinaryConfigured(): boolean {
  return Boolean(CLOUD_NAME && API_KEY && API_SECRET);
}

// ─── Tipos ──────────────────────────────────────────────────────────────────────

export interface SignedUploadParams {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  uploadUrl: string;
}

// ─── Generación de firma ────────────────────────────────────────────────────────

/**
 * Genera los parámetros necesarios para que el frontend suba un archivo
 * directamente a Cloudinary.
 *
 * @param folder  Carpeta destino dentro de Cloudinary, p. ej. "animales" o "reportes".
 *                Sirve para organizar y poder limpiar/filtrar después.
 */
export function generateSignedUploadParams(folder: string): SignedUploadParams {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary no está configurado. Define CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en el .env');
  }

  // Timestamp en segundos (requerido por Cloudinary, no milisegundos)
  const timestamp = Math.round(Date.now() / 1000);

  // Cloudinary firma un string con TODOS los parámetros que el cliente
  // enviará (excepto file, api_key y signature), ordenados alfabéticamente,
  // en formato "param1=valor1&param2=valor2", concatenado con el API_SECRET,
  // y hasheado con SHA-1.
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

  return {
    cloudName: CLOUD_NAME,
    apiKey: API_KEY,
    timestamp,
    signature,
    folder,
    uploadUrl: `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
  };
}

// ─── Eliminación de imágenes (opcional, para cuando se borra un animal/reporte) ─

/**
 * Elimina una imagen de Cloudinary dado su `public_id`.
 * Útil para limpiar recursos al borrar un animal o reporte.
 *
 * El public_id se puede extraer de la URL de Cloudinary, normalmente es
 * "carpeta/nombre_archivo" (sin extensión).
 */
export async function deleteCloudinaryImage(publicId: string): Promise<boolean> {
  if (!isCloudinaryConfigured()) return false;

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

  const body = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: API_KEY,
    signature,
  });

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const data = await response.json();
  return data.result === 'ok';
}

/**
 * Extrae el public_id de una URL de Cloudinary.
 * Ejemplo:
 *   https://res.cloudinary.com/demo/image/upload/v1234567890/animales/abc123.jpg
 *   → "animales/abc123"
 */
export function extractPublicIdFromUrl(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
  return match ? match[1] : null;
}
