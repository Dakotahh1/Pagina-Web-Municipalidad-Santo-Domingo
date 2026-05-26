import { Router } from 'express';
import * as ctrl from '../controllers/authController';
import { verifyJWT, requireRole } from '../middlewares/authMiddleware';

const router = Router();

//─── Rutas públicas (no requieren token) ─────────────────────────────────────

//POST /api/auth/login
//Body: { email, password }
router.post('/login', ctrl.login);

//POST /api/auth/register
//Body: { nombre, rut, correo, password, region, comuna }
router.post('/register', ctrl.register);

// POST /api/auth/admin-login
// Body: { email, password } solo funcionarios e inspectores
router.post('/admin-login', ctrl.adminLogin);

//─── Rutas protegidas (requieren JWT válido) ──────────────────────────────────

//GET /api/auth/me
//Header: Authorization: Bearer <token>

router.get('/me', verifyJWT, ctrl.getMe);

//GET /api/auth/admin/panel
//Solo funcionarios e inspectores

router.get(
  '/admin/panel',
  verifyJWT,
  requireRole(['funcionario', 'inspector']),
  (_req, res) => {
    res.status(200).json({
      success: true,
      data: { mensaje: 'Acceso al panel de gestión municipal autorizado.' },
    });
  }
);

//GET /api/auth/inspector/chips
//Solo inspectores
router.get(
  '/inspector/chips',
  verifyJWT,
  requireRole(['inspector']),
  (_req, res) => {
    res.status(200).json({
      success: true,
      data: { mensaje: 'Módulo de control de chips — solo inspectores.' },
    });
  }
);

export default router;