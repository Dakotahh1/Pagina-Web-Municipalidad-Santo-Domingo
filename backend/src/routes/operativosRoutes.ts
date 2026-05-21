import { Router } from 'express';
import * as ctrl from '../controllers/operativosController';

const router = Router();

router.get   ('/',     ctrl.getOperativos);
router.get   ('/:id',  ctrl.getOperativoById);
router.post  ('/',     ctrl.createOperativo);
router.put   ('/:id',  ctrl.replaceOperativo);
router.patch ('/:id',  ctrl.patchOperativo);
router.delete('/:id',  ctrl.deleteOperativo);

export default router;
