import { Router } from 'express';
import * as ctrl from '../controllers/reportesController';

const router = Router();

router.get   ('/',     ctrl.getReportes);
router.get   ('/:id',  ctrl.getReporteById);
router.post  ('/',     ctrl.createReporte);
router.patch ('/:id',  ctrl.patchReporte);
router.delete('/:id',  ctrl.deleteReporte);

export default router;
