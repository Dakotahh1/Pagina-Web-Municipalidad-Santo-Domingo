import { Router } from 'express';
import {
  getReportes,
  getReporteById,
  createReporte,
  patchReporte,
  deleteReporte,
} from '../controllers/reportesController';
import { verifyJWT, requireRole } from '../middlewares/authMiddleware';
import { cache } from '../middlewares/cacheMiddleware';

const router = Router();

// Lectura de reportes — solo funcionarios e inspectores (datos personales de
// los vecinos denunciantes; ver matriz de permisos del README). El caché corre
// DESPUÉS de la autorización, así nunca sirve datos a quien no corresponde.
router.get('/',    verifyJWT, requireRole(['funcionario', 'inspector']), cache(30, 'reportes'), getReportes);
router.get('/:id', verifyJWT, requireRole(['funcionario', 'inspector']), cache(60, 'reportes'), getReporteById);

router.post(  '/',    verifyJWT, createReporte);
router.patch( '/:id', verifyJWT, requireRole(['funcionario', 'inspector']), patchReporte);
router.delete('/:id', verifyJWT, requireRole(['funcionario', 'inspector']), deleteReporte);

export default router;
