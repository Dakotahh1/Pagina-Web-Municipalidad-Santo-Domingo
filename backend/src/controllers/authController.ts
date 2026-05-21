import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ok, created, badRequest, unauthorized } from '../utils/responseHelper';

/*controller de autenticación. en EP 2.5 se agregará la generación de JWT,
  y en EP 2.6 el hashing de contraseñas con bcrypt.
  
  por ahora retorna un token mock para que el frontend pueda probar la integración*/

// POST /api/auth/login
export const login = (req: Request, res: Response): void => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    badRequest(res, 'Email y contraseña son obligatorios');
    return;
  }
  if (role && !['vecino', 'funcionario'].includes(role)) {
    badRequest(res, 'Rol inválido. Debe ser "vecino" o "funcionario"');
    return;
  }

  // EP 2.5: validar credenciales contra la BD con bcrypt.compare()
  if (password.length < 4) {
    unauthorized(res, 'Credenciales inválidas');
    return;
  }

  ok(res, {
    token: `mock-jwt-${uuidv4()}`,
    user: {
      id: uuidv4(),
      email,
      role: role ?? 'vecino',
    }
  }, 'Inicio de sesión exitoso');
};

// POST /api/auth/register
export const register = (req: Request, res: Response): void => {
  const { nombre, rut, correo, password, region, comuna } = req.body;

  if (!nombre || !rut || !correo || !password || !region || !comuna) {
    badRequest(res, 'Faltan campos obligatorios', {
      required: ['nombre', 'rut', 'correo', 'password', 'region', 'comuna']
    });
    return;
  }
  if (password.length < 8) {
    badRequest(res, 'La contraseña debe tener al menos 8 caracteres');
    return;
  }
  const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[0-9kK]$/;
  if (!rutRegex.test(rut)) {
    badRequest(res, 'Formato de RUT inválido. Use el formato 12.345.678-9');
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    badRequest(res, 'Formato de correo inválido');
    return;
  }

  // EP 2.6: hashear la contraseña con bcrypt antes de guardarla
  created(res, {
    id: uuidv4(),
    nombre, rut, correo, region, comuna,
    rol: 'vecino',
  }, 'Usuario registrado exitosamente');
};
