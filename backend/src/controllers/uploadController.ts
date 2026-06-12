/**
 * uploadController.ts
 * ──────────────────────
 * Expone el endpoint que el frontend llama ANTES de subir una imagen
 * a Cloudinary, para obtener los parámetros firmados.
 */

import { Request, Response } from 'express';
import { generateSignedUploadParams, isCloudinaryConfigured } from '../lib/cloudinaryService';
import { ok, badRequest } from '../utils/responseHelper';

// Carpetas permitidas — evita que cualquiera mande folder="lo-que-sea"
const CARPETAS_PERMITIDAS = ['animales', 'reportes'] as const;
type CarpetaPermitida = typeof CARPETAS_PERMITIDAS[number];

// ─── GET /api/uploads/signature?folder=animales ────────────────────────────────

export const getUploadSignature = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isCloudinaryConfigured()) {
      res.status(503).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'El servicio de subida de imágenes no está configurado. Define las variables CLOUDINARY_* en el .env',
        },
      });
      return;
    }

    const folder = String(req.query.folder ?? '');

    if (!CARPETAS_PERMITIDAS.includes(folder as CarpetaPermitida)) {
      badRequest(res, `Carpeta inválida. Debe ser una de: ${CARPETAS_PERMITIDAS.join(', ')}`);
      return;
    }

    const params = generateSignedUploadParams(folder);
    ok(res, params, 'Firma generada. Válida por unos minutos.');
  } catch (error) {
    console.error('[UploadController] Error generando firma:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};
