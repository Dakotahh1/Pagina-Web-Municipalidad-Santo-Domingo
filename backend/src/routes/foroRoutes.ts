import { Router } from 'express';
import * as ctrl from '../controllers/foroController';
import { verifyJWT, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Lectura pública del foro
router.get('/', ctrl.getPublicaciones);

// Publicar — cualquier usuario autenticado
router.post('/', verifyJWT, ctrl.createPublicacion);

// Moderación (eliminar) — solo funcionarios e inspectores
router.delete('/:id', verifyJWT, requireRole(['funcionario', 'inspector']), ctrl.deletePublicacion);

export default router;
