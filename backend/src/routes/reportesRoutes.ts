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

// Reportes requieren login para leer (datos sensibles de la municipalidad)
router.get('/',    verifyJWT, cache(30, 'reportes'), getReportes);
router.get('/:id', verifyJWT, cache(60, 'reportes'), getReporteById);

router.post(  '/',    verifyJWT, createReporte);
router.patch( '/:id', verifyJWT, requireRole(['funcionario', 'inspector']), patchReporte);
router.delete('/:id', verifyJWT, requireRole(['funcionario', 'inspector']), deleteReporte);

export default router;
