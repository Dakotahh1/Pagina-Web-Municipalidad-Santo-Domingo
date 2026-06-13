import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt.utils';
import { UserRole } from '../types/auth.types';

//─────────────────────────────────────────────────────────────────────────────
//INTERCEPTOR JWT
//Se ejecuta ANTES del controller en rutas protegidas.
//Si el token no es válido → corta la cadena y devuelve 401.
//Si es válido → adjunta req.usuario y llama next().

//Uso en rutas:
//router.get('/ruta', verifyJWT, miController)
// ─────────────────────────────────────────────────────────────────────────────

export const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
  try {
    //Extraer token del header Authorization: Bearer <token>
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_MISSING',
          message: 'Se requiere autenticación. Header: Authorization: Bearer <token>',
        },
      });
      return;
    }

    //Verificar firma y expiración
    const payload = verifyToken(token);

    //Adjuntar payload al request para que el controller lo use
    req.usuario = payload;

    //Continuar al siguiente middleware o controller
    next();

  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'El token ha expirado. Inicia sesión nuevamente.',
        },
      });
      return;
    }
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_INVALID',
          message: 'Token inválido o malformado.',
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: { code: 'AUTH_ERROR', message: 'Error interno de autenticación.' },
    });
  }
};

//─────────────────────────────────────────────────────────────────────────────
//MIDDLEWARE DE ROL
//Siempre se usa DESPUÉS de verifyJWT, y necesita que req.usuario exista.

//Uso en rutas:
//router.post('/operativos', verifyJWT, requireRole(['funcionario', 'inspector']), ctrl)
// ─────────────────────────────────────────────────────────────────────────────

export const requireRole = (rolesPermitidos: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.usuario) {
      res.status(401).json({
        success: false,
        error: { code: 'NOT_AUTHENTICATED', message: 'No autenticado.' },
      });
      return;
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Acceso denegado. Roles permitidos: ${rolesPermitidos.join(', ')}`,
        },
      });
      return;
    }

    next();
  };
};