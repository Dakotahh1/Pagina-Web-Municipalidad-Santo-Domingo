import { Router } from 'express';
import * as ctrl from '../controllers/operativosController';
import { verifyJWT, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Lectura pública — vecinos necesitan ver operativos para inscribirse
router.get   ('/',     ctrl.getOperativos);
router.get   ('/:id',  ctrl.getOperativoById);

// Inscripción del vecino (cualquier usuario autenticado) — decremento atómico de cupos
router.post  ('/:id/inscribir', verifyJWT, ctrl.inscribirse);

// Gestión — solo funcionarios e inspectores
router.post  ('/',     verifyJWT, requireRole(['funcionario', 'inspector']), ctrl.createOperativo);
router.put   ('/:id',  verifyJWT, requireRole(['funcionario', 'inspector']), ctrl.replaceOperativo);
router.patch ('/:id',  verifyJWT, requireRole(['funcionario', 'inspector']), ctrl.patchOperativo);
router.delete('/:id',  verifyJWT, requireRole(['funcionario', 'inspector']), ctrl.deleteOperativo);

export default router;
