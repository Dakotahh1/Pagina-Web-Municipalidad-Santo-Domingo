/**
 * animalesController.ts — OPTIMIZADO
 * ────────────────────────────────────
 * Cambios respecto al original:
 *
 * 1. PAGINACIÓN  — getAnimales acepta ?page=1&limit=20 para evitar traer
 *    toda la tabla en una sola query.
 *
 * 2. SELECT EXPLÍCITO en getAnimales — solo se proyectan los campos que
 *    la UI necesita para el listado (no descripción completa, no fotos).
 *    getAnimalById sigue devolviendo el registro completo.
 *
 * 3. ELIMINACIÓN DE DOUBLE-FETCH — patchAnimal, replaceAnimal y deleteAnimal
 *    ya NO hacen findUnique + update/delete por separado.
 *    Se usa update/delete directamente y se captura el error P2025 de Prisma
 *    (record not found) para devolver 404, en un solo viaje a la BD.
 *
 * 4. INVALIDACIÓN DE CACHÉ — las mutaciones invalidan las entradas cacheadas
 *    del recurso 'animales' para que el próximo GET sea fresco.
 */

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prismaClient';
import { ok, created, list, badRequest, notFound, noContent } from '../utils/responseHelper';
import { invalidateCache } from '../middlewares/cacheMiddleware';

// ─── Constantes ───────────────────────────────────────────────────────────────

const CACHE_KEY = 'animales';
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

// Campos proyectados para el listado (tarjetas de adopción).
// getAnimalById devuelve el registro completo.
const LISTADO_SELECT = {
  id: true,
  nombre: true,
  especie: true,
  raza: true,
  sexo: true,
  edad: true,
  color: true,
  vacunado: true,
  castrado: true,
  estado_adopcion: true,
  imagenes: true,
  fecha_creacion: true,
} satisfies Prisma.MascotaSelect;

// ─── GET /api/animales?estado=Disponible&especie=Perro&page=1&limit=20 ────────

export const getAnimales = async (req: Request, res: Response): Promise<void> => {
  try {
    const { estado, especie } = req.query;

    // Paginación con valores seguros
    const page  = Math.max(1, parseInt(String(req.query.page  ?? '1')));
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(String(req.query.limit ?? String(DEFAULT_PAGE_SIZE)))));
    const skip  = (page - 1) * limit;

    const where: Prisma.MascotaWhereInput = {
      ...(estado  ? { estado_adopcion: String(estado)  } : {}),
      ...(especie ? { especie:         String(especie) } : {}),
    };

    // count + findMany en paralelo → un solo round-trip al pool de conexiones
    const [total, mascotas] = await prisma.$transaction([
      prisma.mascota.count({ where }),
      prisma.mascota.findMany({
        where,
        select: LISTADO_SELECT,
        orderBy: { fecha_creacion: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    list(res, mascotas, total, { page, limit, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─── GET /api/animales/:id ────────────────────────────────────────────────────

export const getAnimalById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }

    const mascota = await prisma.mascota.findUnique({ where: { id } });
    if (!mascota) { notFound(res, `Animal con id ${id} no encontrado`); return; }

    ok(res, mascota);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─── POST /api/animales ───────────────────────────────────────────────────────

export const createAnimal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, especie, raza, sexo, edad } = req.body;

    if (!nombre || !especie || !raza || !sexo || edad === undefined) {
      badRequest(res, 'Faltan campos obligatorios', { required: ['nombre', 'especie', 'raza', 'sexo', 'edad'] });
      return;
    }
    if (!['Perro', 'Gato'].includes(especie)) {
      badRequest(res, 'Especie inválida. Debe ser "Perro" o "Gato"'); return;
    }
    if (!['Macho', 'Hembra'].includes(sexo)) {
      badRequest(res, 'Sexo inválido. Debe ser "Macho" o "Hembra"'); return;
    }

    const mascota = await prisma.mascota.create({
      data: {
        nombre, especie, raza, sexo, edad: parseInt(edad),
        color:           req.body.color    ?? '',
        vacunado:        req.body.vacunado ?? false,
        castrado:        req.body.castrado ?? false,
        chip:            req.body.chip     ?? null,
        descripcion:     req.body.notas    ?? '',
        estado_adopcion: req.body.estado   ?? 'Disponible',
        imagenes:        req.body.imagenes ?? [],
      },
    });

    invalidateCache(CACHE_KEY);
    created(res, mascota, 'Animal registrado exitosamente');
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─── PATCH /api/animales/:id ──────────────────────────────────────────────────
// Optimización: un solo UPDATE; si el registro no existe Prisma lanza P2025.

export const patchAnimal = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }

    const mascota = await prisma.mascota.update({
      where: { id },
      data: {
        ...(req.body.nombre    !== undefined && { nombre:          req.body.nombre    }),
        ...(req.body.especie   !== undefined && { especie:         req.body.especie   }),
        ...(req.body.raza      !== undefined && { raza:            req.body.raza      }),
        ...(req.body.sexo      !== undefined && { sexo:            req.body.sexo      }),
        ...(req.body.edad      !== undefined && { edad:            req.body.edad      }),
        ...(req.body.color     !== undefined && { color:           req.body.color     }),
        ...(req.body.vacunado  !== undefined && { vacunado:        req.body.vacunado  }),
        ...(req.body.castrado  !== undefined && { castrado:        req.body.castrado  }),
        ...(req.body.chip      !== undefined && { chip:            req.body.chip      }),
        ...(req.body.estado    !== undefined && { estado_adopcion: req.body.estado    }),
        ...(req.body.notas     !== undefined && { descripcion:     req.body.notas     }),
        ...(req.body.imagenes  !== undefined && { imagenes:        req.body.imagenes  }),
      },
    });

    invalidateCache(CACHE_KEY);
    ok(res, mascota, 'Animal actualizado');
  } catch (error) {
    if ((error as any)?.code === 'P2025') { notFound(res, `Animal con id ${req.params.id} no encontrado`); return; }
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─── PUT /api/animales/:id ────────────────────────────────────────────────────

export const replaceAnimal = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }

    const { nombre, especie, raza, sexo, edad } = req.body;
    if (!nombre || !especie || !raza || !sexo || edad === undefined) {
      badRequest(res, 'PUT requiere TODOS los campos del recurso'); return;
    }

    const mascota = await prisma.mascota.update({
      where: { id },
      data: {
        nombre, especie, raza, sexo, edad,
        color:           req.body.color    ?? '',
        vacunado:        req.body.vacunado ?? false,
        castrado:        req.body.castrado ?? false,
        chip:            req.body.chip     ?? null,
        descripcion:     req.body.notas    ?? '',
        estado_adopcion: req.body.estado   ?? 'Disponible',
      },
    });

    invalidateCache(CACHE_KEY);
    ok(res, mascota, 'Animal actualizado completamente');
  } catch (error) {
    if ((error as any)?.code === 'P2025') { notFound(res, `Animal con id ${req.params.id} no encontrado`); return; }
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─── DELETE /api/animales/:id ─────────────────────────────────────────────────

export const deleteAnimal = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }

    await prisma.mascota.delete({ where: { id } });

    invalidateCache(CACHE_KEY);
    noContent(res);
  } catch (error) {
    if ((error as any)?.code === 'P2025') { notFound(res, `Animal con id ${req.params.id} no encontrado`); return; }
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};
