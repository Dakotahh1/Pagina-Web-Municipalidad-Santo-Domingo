/**
 * operativosController.ts — OPTIMIZADO
 * ──────────────────────────────────────
 * Cambios:
 * 1. PAGINACIÓN en getOperativos.
 * 2. DOUBLE-FETCH ELIMINADO en patchOperativo, replaceOperativo, deleteOperativo.
 * 3. INVALIDACIÓN DE CACHÉ tras mutaciones.
 */

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prismaClient';
import { ok, created, list, badRequest, notFound, noContent, conflict } from '../utils/responseHelper';
import { invalidateCache } from '../middlewares/cacheMiddleware';

const CACHE_KEY = 'operativos';
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

// ─── GET /api/operativos?estado=Programado&tipo=Vacunación&page=1&limit=20 ────

export const getOperativos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { estado, tipo } = req.query;

    const page  = Math.max(1, parseInt(String(req.query.page  ?? '1')));
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(String(req.query.limit ?? String(DEFAULT_PAGE_SIZE)))));
    const skip  = (page - 1) * limit;

    const where: Prisma.OperativoWhereInput = {
      ...(estado ? { estado: String(estado) } : {}),
      ...(tipo   ? { tipo:   String(tipo)   } : {}),
    };

    const [total, operativos] = await prisma.$transaction([
      prisma.operativo.count({ where }),
      prisma.operativo.findMany({
        where,
        orderBy: { fecha_evento: 'asc' },
        skip,
        take: limit,
      }),
    ]);

    list(res, operativos, total, { page, limit, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─── GET /api/operativos/:id ──────────────────────────────────────────────────

export const getOperativoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }

    const operativo = await prisma.operativo.findUnique({
      where: { id },
      include: {
        inscripciones: { include: { usuario: { select: { nombre_completo: true } } } },
      },
    });
    if (!operativo) { notFound(res, `Operativo con id ${id} no encontrado`); return; }

    ok(res, operativo);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─── POST /api/operativos ─────────────────────────────────────────────────────

export const createOperativo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { titulo, tipo, fecha, hora, ubicacion, cupos } = req.body;
    if (!titulo || !tipo || !fecha || !hora || !ubicacion || cupos === undefined) {
      badRequest(res, 'Faltan campos obligatorios', { required: ['titulo', 'tipo', 'fecha', 'hora', 'ubicacion', 'cupos'] }); return;
    }
    if (!['Vacunación', 'Esterilización', 'Chipeo', 'Mixto'].includes(tipo)) {
      badRequest(res, 'Tipo inválido. Debe ser "Vacunación", "Esterilización", "Chipeo" o "Mixto"'); return;
    }

    const operativo = await prisma.operativo.create({
      data: {
        titulo, tipo, hora, ubicacion,
        descripcion:       req.body.descripcion ?? '',
        fecha_evento:      new Date(fecha),
        cupos_totales:     parseInt(cupos),
        cupos_disponibles: parseInt(cupos),
        estado:            'Programado',
      },
    });

    invalidateCache(CACHE_KEY);
    created(res, operativo, 'Operativo creado exitosamente');
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─── PATCH /api/operativos/:id ────────────────────────────────────────────────

export const patchOperativo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }

    const operativo = await prisma.operativo.update({
      where: { id },
      data: {
        ...(req.body.titulo            !== undefined && { titulo:             req.body.titulo            }),
        ...(req.body.estado            !== undefined && { estado:             req.body.estado            }),
        ...(req.body.cuposDisponibles  !== undefined && { cupos_disponibles:  req.body.cuposDisponibles  }),
        ...(req.body.descripcion       !== undefined && { descripcion:        req.body.descripcion       }),
      },
    });

    invalidateCache(CACHE_KEY);
    ok(res, operativo, 'Operativo actualizado');
  } catch (error) {
    if ((error as any)?.code === 'P2025') { notFound(res, `Operativo con id ${req.params.id} no encontrado`); return; }
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─── PUT /api/operativos/:id ──────────────────────────────────────────────────

export const replaceOperativo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }

    const { titulo, tipo, fecha, hora, ubicacion, cupos } = req.body;
    if (!titulo || !tipo || !fecha || !hora || !ubicacion || cupos === undefined) {
      badRequest(res, 'PUT requiere TODOS los campos del recurso'); return;
    }

    const operativo = await prisma.operativo.update({
      where: { id },
      data: {
        titulo, tipo, hora, ubicacion,
        fecha_evento:      new Date(fecha),
        cupos_totales:     parseInt(cupos),
        cupos_disponibles: req.body.cuposDisponibles ?? parseInt(cupos),
        descripcion:       req.body.descripcion ?? '',
        estado:            req.body.estado ?? 'Programado',
      },
    });

    invalidateCache(CACHE_KEY);
    ok(res, operativo, 'Operativo actualizado completamente');
  } catch (error) {
    if ((error as any)?.code === 'P2025') { notFound(res, `Operativo con id ${req.params.id} no encontrado`); return; }
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─── POST /api/operativos/:id/inscribir ───────────────────────────────────────
// El vecino autenticado se inscribe (RF-04). El decremento de cupos es atómico:
// el updateMany condicionado (cupos > 0) y la creación de la inscripción ocurren
// en una misma transacción; si el usuario ya estaba inscrito (índice único),
// todo se revierte. Tras inscribir se invalida el caché (los cupos cambiaron).
export const inscribirse = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }

    const existe = await prisma.operativo.findUnique({ where: { id } });
    if (!existe) { notFound(res, `Operativo con id ${id} no encontrado`); return; }
    if (existe.estado !== 'Programado') {
      conflict(res, `El operativo no admite inscripciones (estado: ${existe.estado})`);
      return;
    }

    const inscripcion = await prisma.$transaction(async (tx) => {
      const decremento = await tx.operativo.updateMany({
        where: { id, cupos_disponibles: { gt: 0 } },
        data: { cupos_disponibles: { decrement: 1 } },
      });
      if (decremento.count === 0) throw new Error('SIN_CUPOS');
      return tx.inscripcionOperativo.create({
        data: { operativo_id: id, usuario_id: parseInt(req.usuario!.sub) },
      });
    });

    const actualizado = await prisma.operativo.findUnique({ where: { id } });

    invalidateCache(CACHE_KEY);
    created(res, { inscripcion, cupos_disponibles: actualizado?.cupos_disponibles }, 'Inscripción confirmada');
  } catch (error: any) {
    if (error?.code === 'P2002') { conflict(res, 'Ya estás inscrito en este operativo'); return; }
    if (error?.message === 'SIN_CUPOS') { conflict(res, 'No quedan cupos disponibles'); return; }
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─── DELETE /api/operativos/:id ───────────────────────────────────────────────

export const deleteOperativo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }

    await prisma.operativo.delete({ where: { id } });

    invalidateCache(CACHE_KEY);
    noContent(res);
  } catch (error) {
    if ((error as any)?.code === 'P2025') { notFound(res, `Operativo con id ${req.params.id} no encontrado`); return; }
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};
