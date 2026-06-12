/**
 * uploadRoutes.ts
 * ─────────────────
 * Endpoint para obtener firma de subida a Cloudinary.
 * Requiere autenticación: solo usuarios logueados pueden subir imágenes
 * (vecinos para reportes, funcionarios para fichas de animales).
 */

import { Router } from 'express';
import { getUploadSignature } from '../controllers/uploadController';
import { verifyJWT } from '../middlewares/authMiddleware';

const router = Router();

router.get('/signature', verifyJWT, getUploadSignature);

export default router;
