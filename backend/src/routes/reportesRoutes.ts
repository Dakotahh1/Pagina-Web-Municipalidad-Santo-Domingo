import { Router } from 'express';
import * as ctrl from '../controllers/reportesController';
import { verifyJWT, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Listado de reportes — solo funcionarios e inspectores
router.get   ('/',     verifyJWT, requireRole(['funcionario', 'inspector']), ctrl.getReportes);
router.get   ('/:id',  verifyJWT, requireRole(['funcionario', 'inspector']), ctrl.getReporteById);

// Vecino crea reporte (cualquier usuario autenticado)
router.post  ('/',     verifyJWT, ctrl.createReporte);

// Actualización y eliminación — solo funcionarios e inspectores
router.patch ('/:id',  verifyJWT, requireRole(['funcionario', 'inspector']), ctrl.patchReporte);
router.delete('/:id',  verifyJWT, requireRole(['funcionario', 'inspector']), ctrl.deleteReporte);

export default router;
