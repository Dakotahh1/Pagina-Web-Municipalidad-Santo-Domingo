import { Router } from 'express';
import {
  getAnimales,
  getAnimalById,
  createAnimal,
  patchAnimal,
  replaceAnimal,
  deleteAnimal,
} from '../controllers/animalesController';
import { verifyJWT, requireRole } from '../middlewares/authMiddleware';
import { cache } from '../middlewares/cacheMiddleware';

const router = Router();

// ── Lectura (público — cualquiera puede ver animales disponibles) ──────────────
router.get('/',    cache(60,  'animales'), getAnimales);
router.get('/:id', cache(120, 'animales'), getAnimalById);

// ── Escritura (requieren autenticación + rol funcionario o inspector) ──────────
router.post(  '/',    verifyJWT, requireRole(['funcionario', 'inspector']), createAnimal);
router.patch( '/:id', verifyJWT, requireRole(['funcionario', 'inspector']), patchAnimal);
router.put(   '/:id', verifyJWT, requireRole(['funcionario', 'inspector']), replaceAnimal);
router.delete('/:id', verifyJWT, requireRole(['funcionario', 'inspector']), deleteAnimal);

export default router;
