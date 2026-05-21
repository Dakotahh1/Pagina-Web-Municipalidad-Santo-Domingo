import { Router } from 'express';
import * as ctrl from '../controllers/animalesController';

const router = Router();

router.get   ('/',     ctrl.getAnimales);
router.get   ('/:id',  ctrl.getAnimalById);
router.post  ('/',     ctrl.createAnimal);
router.put   ('/:id',  ctrl.replaceAnimal);
router.patch ('/:id',  ctrl.patchAnimal);
router.delete('/:id',  ctrl.deleteAnimal);

export default router;
