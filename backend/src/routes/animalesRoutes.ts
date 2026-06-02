import { Router } from 'express';
import * as ctrl from '../controllers/animalesController';
import { verifyJWT, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Lectura pública — vecinos pueden ver animales disponibles
router.get   ('/',     ctrl.getAnimales);
router.get   ('/:id',  ctrl.getAnimalById);

// Escritura — solo funcionarios e inspectores
router.post  ('/',     verifyJWT, requireRole(['funcionario', 'inspector']), ctrl.createAnimal);
router.put   ('/:id',  verifyJWT, requireRole(['funcionario', 'inspector']), ctrl.replaceAnimal);
router.patch ('/:id',  verifyJWT, requireRole(['funcionario', 'inspector']), ctrl.patchAnimal);
router.delete('/:id',  verifyJWT, requireRole(['funcionario', 'inspector']), ctrl.deleteAnimal);

export default router;
