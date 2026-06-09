import { Router } from 'express';
import {
  getOperativos,
  getOperativoById,
  createOperativo,
  patchOperativo,
  replaceOperativo,
  deleteOperativo,
} from '../controllers/operativosController';
import { verifyJWT, requireRole } from '../middlewares/authMiddleware';
import { cache } from '../middlewares/cacheMiddleware';

const router = Router();

// Operativos son públicos (vecinos los consultan sin login)
router.get('/',    cache(120, 'operativos'), getOperativos);
router.get('/:id', cache(180, 'operativos'), getOperativoById);

router.post(  '/',    verifyJWT, requireRole(['funcionario', 'inspector']), createOperativo);
router.patch( '/:id', verifyJWT, requireRole(['funcionario', 'inspector']), patchOperativo);
router.put(   '/:id', verifyJWT, requireRole(['funcionario', 'inspector']), replaceOperativo);
router.delete('/:id', verifyJWT, requireRole(['funcionario', 'inspector']), deleteOperativo);

export default router;
