import { Router } from 'express';
import {
  getOperativos,
  getOperativoById,
  createOperativo,
  patchOperativo,
  replaceOperativo,
  deleteOperativo,
  inscribirse,
} from '../controllers/operativosController';
import { verifyJWT, requireRole } from '../middlewares/authMiddleware';
import { cache } from '../middlewares/cacheMiddleware';

const router = Router();

// Operativos son públicos (vecinos los consultan sin login)
router.get('/',    cache(120, 'operativos'), getOperativos);
router.get('/:id', cache(180, 'operativos'), getOperativoById);

// Inscripción del vecino (cualquier usuario autenticado) — decremento atómico de cupos
router.post('/:id/inscribir', verifyJWT, inscribirse);

// Gestión — solo funcionarios e inspectores
router.post(  '/',    verifyJWT, requireRole(['funcionario', 'inspector']), createOperativo);
router.patch( '/:id', verifyJWT, requireRole(['funcionario', 'inspector']), patchOperativo);
router.put(   '/:id', verifyJWT, requireRole(['funcionario', 'inspector']), replaceOperativo);
router.delete('/:id', verifyJWT, requireRole(['funcionario', 'inspector']), deleteOperativo);

export default router;
