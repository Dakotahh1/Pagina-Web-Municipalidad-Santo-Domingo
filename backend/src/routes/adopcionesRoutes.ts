import { Router } from 'express';
import * as ctrl from '../controllers/adopcionesController';
import { verifyJWT, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Listado — solo funcionarios e inspectores
router.get   ('/',     verifyJWT, requireRole(['funcionario', 'inspector']), ctrl.getSolicitudes);
router.get   ('/:id',  verifyJWT, ctrl.getSolicitudById);

// Vecino envía solicitud (cualquier usuario autenticado)
router.post  ('/',     verifyJWT, ctrl.createSolicitud);

// Gestión de solicitudes — solo funcionarios e inspectores
router.patch ('/:id',  verifyJWT, requireRole(['funcionario', 'inspector']), ctrl.patchSolicitud);
router.delete('/:id',  verifyJWT, requireRole(['funcionario', 'inspector']), ctrl.deleteSolicitud);

export default router;
