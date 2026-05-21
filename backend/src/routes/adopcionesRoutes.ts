import { Router } from 'express';
import * as ctrl from '../controllers/adopcionesController';

const router = Router();

router.get   ('/',     ctrl.getSolicitudes);
router.get   ('/:id',  ctrl.getSolicitudById);
router.post  ('/',     ctrl.createSolicitud);
router.patch ('/:id',  ctrl.patchSolicitud);
router.delete('/:id',  ctrl.deleteSolicitud);

export default router;
