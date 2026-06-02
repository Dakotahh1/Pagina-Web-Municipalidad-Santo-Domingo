import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prismaClient';
import { generateToken } from '../utils/jwt.utils';
import { ok, created, badRequest, unauthorized } from '../utils/responseHelper';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      badRequest(res, 'Email y contraseña son obligatorios');
      return;
    }

    // Query parametrizada — protegida contra SQL injection por Prisma
    const usuario = await prisma.usuario.findUnique({
      where: { correo: email.toLowerCase() },
      include: { rol: true },
    });

    if (!usuario || !usuario.activo) {
      unauthorized(res, 'Credenciales inválidas');
      return;
    }

    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) {
      unauthorized(res, 'Credenciales inválidas');
      return;
    }

    const token = generateToken({
      sub: String(usuario.id),
      correo: usuario.correo,
      rol: usuario.rol.nombre as any,
    });

    ok(res, {
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre_completo,
        correo: usuario.correo,
        rol: usuario.rol.nombre,
      },
    }, `Bienvenido/a, ${usuario.nombre_completo}`);

  } catch (error) {
    console.error('[AuthController] Error en login:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, rut, correo, password, region, comuna } = req.body;

    if (!nombre || !rut || !correo || !password || !region || !comuna) {
      badRequest(res, 'Faltan campos obligatorios', {
        required: ['nombre', 'rut', 'correo', 'password', 'region', 'comuna'],
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

    // Verificar correo duplicado
    const existe = await prisma.usuario.findUnique({ where: { correo } });
    if (existe) {
      res.status(409).json({ success: false, error: { code: 'EMAIL_TAKEN', message: 'Este correo ya está registrado' } });
      return;
    }

    // Verificar RUT duplicado
    const existeRut = await prisma.usuario.findUnique({ where: { rut } });
    if (existeRut) {
      res.status(409).json({ success: false, error: { code: 'RUT_TAKEN', message: 'Este RUT ya está registrado' } });
      return;
    }

    const rolVecino = await prisma.rol.findUnique({ where: { nombre: 'vecino' } });
    if (!rolVecino) {
      res.status(500).json({ success: false, error: { code: 'SETUP_ERROR', message: 'Roles no inicializados. Ejecuta el seed.' } });
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre_completo: nombre,
        rut,
        correo,
        password_hash,
        region,
        comuna,
        rol_id: rolVecino.id,
      },
      include: { rol: true },
    });

    const token = generateToken({
      sub: String(nuevoUsuario.id),
      correo: nuevoUsuario.correo,
      rol: nuevoUsuario.rol.nombre as any,
    });

    created(res, {
      token,
      user: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre_completo,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol.nombre,
      },
    }, 'Usuario registrado exitosamente');

  } catch (error) {
    console.error('[AuthController] Error en register:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/admin-login — solo funcionarios e inspectores
// ─────────────────────────────────────────────────────────────────────────────
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      badRequest(res, 'Email y contraseña son obligatorios');
      return;
    }

    const usuario = await prisma.usuario.findUnique({
      where: { correo: email.toLowerCase() },
      include: { rol: true },
    });

    if (!usuario || !usuario.activo) {
      unauthorized(res, 'Credenciales inválidas');
      return;
    }

    // Verificar contraseña ANTES de revelar el rol (evita enumeración de cuentas)
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) {
      unauthorized(res, 'Credenciales inválidas');
      return;
    }

    if (usuario.rol.nombre === 'vecino') {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Acceso denegado. Solo funcionarios municipales.' },
      });
      return;
    }

    const token = generateToken({
      sub: String(usuario.id),
      correo: usuario.correo,
      rol: usuario.rol.nombre as any,
    });

    ok(res, {
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre_completo,
        correo: usuario.correo,
        rol: usuario.rol.nombre,
      },
    }, `Panel de gestión — Bienvenido/a, ${usuario.nombre_completo}`);

  } catch (error) {
    console.error('[AuthController] Error en adminLogin:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me — ruta protegida
// ─────────────────────────────────────────────────────────────────────────────
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(req.usuario!.sub) },
      include: { rol: true },
    });

    if (!usuario) {
      res.status(404).json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'Usuario no encontrado' } });
      return;
    }

    ok(res, {
      id: usuario.id,
      nombre: usuario.nombre_completo,
      correo: usuario.correo,
      rol: usuario.rol.nombre,
      region: usuario.region,
      comuna: usuario.comuna,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};
