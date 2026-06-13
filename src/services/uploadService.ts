/* Servicio de subida de imágenes a Cloudinary (EF5 — integración con API de terceros).

   Estrategia "signed upload": el backend firma la subida con su API_SECRET (que nunca
   viaja al cliente) y el archivo va directo del navegador a Cloudinary, sin pasar por
   nuestro servidor. El flujo es:
     1. GET /api/uploads/signature?folder=...  → el backend devuelve la firma.
     2. POST del archivo directo a Cloudinary con esa firma.
     3. Se devuelve la URL pública (https) de la imagen ya alojada. */

import { apiRequest } from './api';

export type UploadFolder = 'animales' | 'reportes';

interface SignedUploadParams {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  uploadUrl: string;
}

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

/* Sube un archivo a Cloudinary y devuelve su URL pública.
   `onProgress` recibe el porcentaje (0-100) durante la subida. El token JWT lo
   inyecta automáticamente apiRequest al pedir la firma. */
export async function uploadImagen(
  file: File | Blob,
  folder: UploadFolder,
  onProgress?: (percent: number) => void,
): Promise<string> {
  // 1. Firma del backend (requiere sesión iniciada).
  const params = await apiRequest<SignedUploadParams>(`/uploads/signature?folder=${folder}`);

  // 2. Subida directa a Cloudinary. Se usa XMLHttpRequest para poder reportar el
  //    progreso de la carga, algo que fetch no expone de forma nativa.
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', params.apiKey);
  formData.append('timestamp', String(params.timestamp));
  formData.append('signature', params.signature);
  formData.append('folder', params.folder);

  const respuesta = await new Promise<CloudinaryResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', params.uploadUrl);
    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) onProgress(Math.round((e.loaded * 100) / e.total));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText));
      else reject(new Error('La subida de la imagen a Cloudinary falló.'));
    };
    xhr.onerror = () => reject(new Error('Error de red al subir la imagen.'));
    xhr.send(formData);
  });

  return respuesta.secure_url;
}
