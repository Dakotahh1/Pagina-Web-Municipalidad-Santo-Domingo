import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { findUserByCorreo, findUserById, addUser, existeCorreo } from '../data/users';
import { generateToken } from '../utils/jwt.utils';
import { ok, created, badRequest, unauthorized } from '../utils/responseHelper';
import { LoginRequest, RegisterRequest } from '../types/auth.types';

//─────────────────────────────────────────────────────────────────────────────
//POST /api/auth/login
//Login para cualquier rol. Devuelve JWT real firmado con bcrypt + jsonwebtoken.
// ─────────────────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    //Validación de campos
    if (!email || !password) {
      badRequest(res, 'Email y contraseña son obligatorios');
      return;
    }

    //Validación formato email (protección básica contra datos malformados)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      badRequest(res, 'Formato de email inválido');
      return;
    }

    //── Buscar usuario ────────────────────────────────────────────────────────
    //NOTA SOBRE SQL INJECTION:
    //queries parametrizadas:
    //db.query('SELECT * FROM usuarios WHERE correo = $1', [email])
    //NUNCA interpolación directa: WHERE correo = '${email}'

    const usuario = await findUserByCorreo(email);

    //Mismo mensaje para usuario inexistente y contraseña incorrecta.
    //Evita "user enumeration attack" (que alguien detecte si un correo existe).
    if (!usuario || !usuario.activo) {
      unauthorized(res, 'Credenciales inválidas');
      return;
    }

    //── Verificar contraseña con bcrypt ───────────────────────────────────────
    //bcrypt.compare no "desencripta", va a recalcula el hash y compara.
    //Aunque alguien robe la BD, no puede recuperar la contraseña original.

    const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
    if (!passwordValida) {
      unauthorized(res, 'Credenciales inválidas');
      return;
    }

    //── Generar JWT ───────────────────────────────────────────────────────────
    const token = generateToken({
      sub: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
    });

    ok(res, {
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    }, `Bienvenido/a, ${usuario.nombre}`);

  } catch (error) {
    console.error('[AuthController] Error en login:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' },
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//POST /api/auth/register
//Registra un vecino nuevo. Hashea la contraseña con bcrypt antes de guardar.
// ─────────────────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, rut, correo, password, region, comuna }: RegisterRequest = req.body;

    //Validación de campos obligatorios
    if (!nombre || !rut || !correo || !password || !region || !comuna) {
      badRequest(res, 'Faltan campos obligatorios', {
        required: ['nombre', 'rut', 'correo', 'password', 'region', 'comuna'],
      });
      return;
    }

    //Validación longitud contraseña
    if (password.length < 8) {
      badRequest(res, 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    //Validación formato RUT
    const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[0-9kK]$/;
    if (!rutRegex.test(rut)) {
      badRequest(res, 'Formato de RUT inválido. Use el formato 12.345.678-9');
      return;
    }

    //Validación formato correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      badRequest(res, 'Formato de correo inválido');
      return;
    }

    //Verificar que el correo no esté ya registrado
    const yaExiste = await existeCorreo(correo);
    if (yaExiste) {
      res.status(409).json({
        success: false,
        error: { code: 'EMAIL_TAKEN', message: 'Este correo ya está registrado' },
      });
      return;
    }

    //── Hashear contraseña con bcrypt ─────────────────────────────────────────
    //Salt rounds = 10: seguridad y velocidad.
    //Un atacante con la BD tardaría ~100ms por intento de fuerza bruta.

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = {
      id: uuidv4(),
      nombre,
      rut,
      correo,
      passwordHash,   //guardamos el hash y no la contraseña original
      rol: 'vecino' as const,
      region,
      comuna,
      activo: true,
    };

    await addUser(nuevoUsuario);

    //Generar JWT para que el usuario quede autenticado inmediatamente
    const token = generateToken({
      sub: nuevoUsuario.id,
      correo: nuevoUsuario.correo,
      rol: nuevoUsuario.rol,
    });

    created(res, {
      token,
      user: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol,
      },
    }, 'Usuario registrado exitosamente');

  } catch (error) {
    console.error('[AuthController] Error en register:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' },
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//GET /api/auth/me  (ruta protegida que requiere verifyJWT en la ruta, osea, el token)
//Devuelve los datos del usuario autenticado a partir del JWT.
// ─────────────────────────────────────────────────────────────────────────────
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    //req.usuario lo adjuntó el middleware verifyJWT
    const usuario = await findUserById(req.usuario!.sub);
    if (!usuario) {
      res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'Usuario no encontrado' },
      });
      return;
    }

    ok(res, {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      region: usuario.region,
      comuna: usuario.comuna,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' },
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//POST /api/auth/admin-login  (ruta protegida solo para funcionarios e inspectores)
//Mismo flujo que login pero rechaza vecinos explícitamente.
// ─────────────────────────────────────────────────────────────────────────────
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      badRequest(res, 'Email y contraseña son obligatorios');
      return;
    }

    const usuario = await findUserByCorreo(email);
    if (!usuario || !usuario.activo) {
      unauthorized(res, 'Credenciales inválidas');
      return;
    }

    //Solo funcionarios e inspectores pueden acceder al panel de gestión
    if (usuario.rol === 'vecino') {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Acceso denegado. Este portal es solo para funcionarios municipales.',
        },
      });
      return;
    }

    const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
    if (!passwordValida) {
      unauthorized(res, 'Credenciales inválidas');
      return;
    }

    const token = generateToken({
      sub: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
    });

    ok(res, {
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    }, `Panel de gestión — Bienvenido/a, ${usuario.nombre}`);

  } catch (error) {
    console.error('[AuthController] Error en adminLogin:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' },
    });
  }
};