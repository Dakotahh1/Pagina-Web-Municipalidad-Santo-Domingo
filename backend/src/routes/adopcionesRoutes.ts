import { Router } from 'express';
import {
  getSolicitudes,
  getSolicitudById,
  createSolicitud,
  patchSolicitud,
  deleteSolicitud,
} from '../controllers/adopcionesController';
import { verifyJWT, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Adopciones: no se cachean (datos personales de usuarios).
// El listado completo es exclusivo del personal municipal.
router.get('/',    verifyJWT, requireRole(['funcionario', 'inspector']), getSolicitudes);
router.get('/:id', verifyJWT, getSolicitudById);

router.post(  '/',    verifyJWT, createSolicitud);
router.patch( '/:id', verifyJWT, requireRole(['funcionario', 'inspector']), patchSolicitud);
router.delete('/:id', verifyJWT, requireRole(['funcionario', 'inspector']), deleteSolicitud);

export default router;
