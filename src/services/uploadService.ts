/**
 * uploadService.ts
 * ──────────────────
 * Servicio frontend para subir imágenes directamente a Cloudinary
 * usando el flujo de "signed upload".
 *
 * Flujo:
 *   1. uploadImage(file, 'animales') hace lo siguiente internamente:
 *      a) GET /api/uploads/signature?folder=animales  → obtiene firma del backend
 *      b) POST directo a Cloudinary con el archivo + firma
 *      c) Devuelve la URL pública de la imagen subida
 *
 * Uso típico en un formulario:
 *
 *   const url = await uploadImage(file, 'animales');
 *   // luego al guardar el animal:
 *   await api.patch(`/animales/${id}`, { imagenes: [...imagenesActuales, url] });
 */

import axios from 'axios';

// Ajusta esta URL base según tu configuración de servicios existente
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

export type UploadFolder = 'animales' | 'reportes';

interface SignedUploadParams {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  uploadUrl: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  [key: string]: unknown;
}

/**
 * Sube una imagen a Cloudinary y devuelve su URL pública (HTTPS).
 *
 * @param file    Archivo a subir (de un <input type="file"> o cámara de Ionic)
 * @param folder  'animales' o 'reportes'
 * @param token   JWT del usuario (para autenticar el pedido de firma)
 * @param onProgress  callback opcional con el % de progreso (0-100)
 */
export async function uploadImage(
  file: File | Blob,
  folder: UploadFolder,
  token: string,
  onProgress?: (percent: number) => void,
): Promise<string> {

  // 1. Pedir firma al backend
  const { data: signatureResponse } = await axios.get<ApiResponse<SignedUploadParams>>(
    `${API_BASE_URL}/uploads/signature`,
    {
      params: { folder },
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  const { cloudName, apiKey, timestamp, signature, uploadUrl } = signatureResponse.data;

  // 2. Subir directo a Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  formData.append('folder', folder);

  const { data: cloudinaryResponse } = await axios.post<CloudinaryUploadResponse>(
    uploadUrl,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress(percent);
        }
      },
    },
  );

  // 3. Devolver la URL segura (https) de la imagen
  return cloudinaryResponse.secure_url;
}

/**
 * Sube múltiples imágenes en paralelo y devuelve sus URLs en el mismo orden.
 */
export async function uploadMultipleImages(
  files: (File | Blob)[],
  folder: UploadFolder,
  token: string,
): Promise<string[]> {
  return Promise.all(files.map((file) => uploadImage(file, folder, token)));
}
