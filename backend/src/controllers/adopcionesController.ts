/**
 * adopcionesController.ts — OPTIMIZADO
 * ──────────────────────────────────────
 * Cambios:
 * 1. PAGINACIÓN en getSolicitudes.
 * 2. DOUBLE-FETCH ELIMINADO en patchSolicitud y deleteSolicitud.
 *    La lógica de "aprobar → marcar mascota como adoptada" se envuelve en
 *    prisma.$transaction para garantizar atomicidad.
 * 3. INVALIDACIÓN DE CACHÉ tras mutaciones.
 */

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prismaClient';
import { ok, created, list, badRequest, notFound, noContent, conflict } from '../utils/responseHelper';
import { invalidateCache } from '../middlewares/cacheMiddleware';

const CACHE_KEY = 'adopciones';
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

// ─── GET /api/adopciones?estado=Pendiente&page=1&limit=20 ─────────────────────

export const getSolicitudes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { estado } = req.query;

    const page  = Math.max(1, parseInt(String(req.query.page  ?? '1')));
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(String(req.query.limit ?? String(DEFAULT_PAGE_SIZE)))));
    const skip  = (page - 1) * limit;

    const where: Prisma.SolicitudAdopcionWhereInput = estado
      ? { estado_solicitud: String(estado) }
      : {};

    const [total, solicitudes] = await prisma.$transaction([
      prisma.solicitudAdopcion.count({ where }),
      prisma.solicitudAdopcion.findMany({
        where,
        include: {
          usuario: { select: { nombre_completo: true, correo: true } },
          mascota: { select: { nombre: true, especie: true } },
        },
        orderBy: { fecha_solicitud: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    list(res, solicitudes, total, { page, limit, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─── GET /api/adopciones/:id ──────────────────────────────────────────────────

export const getSolicitudById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }

    const solicitud = await prisma.solicitudAdopcion.findUnique({
      where: { id },
      include: {
        usuario: { select: { nombre_completo: true, correo: true } },
        mascota: true,
      },
    });
    if (!solicitud) { notFound(res, `Solicitud con id ${id} no encontrada`); return; }

    ok(res, solicitud);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─── POST /api/adopciones ─────────────────────────────────────────────────────

export const createSolicitud = async (req: Request, res: Response): Promise<void> => {
  try {
    const { animalId, vecinoTelefono, motivo } = req.body;

    if (!animalId || !vecinoTelefono || !motivo) {
      badRequest(res, 'Faltan campos obligatorios', { required: ['animalId', 'vecinoTelefono', 'motivo'] }); return;
    }

    const mascota = await prisma.mascota.findUnique({ where: { id: parseInt(animalId) } });
    if (!mascota) { notFound(res, `Animal con id ${animalId} no existe`); return; }
    if (mascota.estado_adopcion !== 'Disponible') {
      conflict(res, `El animal "${mascota.nombre}" no está disponible (estado: ${mascota.estado_adopcion})`); return;
    }

    const solicitud = await prisma.solicitudAdopcion.create({
      data: {
        usuario_id:       parseInt(req.usuario!.sub),
        mascota_id:       mascota.id,
        motivo,
        telefono:         vecinoTelefono,
        estado_solicitud: 'Pendiente',
      },
    });

    invalidateCache(CACHE_KEY);
    created(res, solicitud, 'Solicitud de adopción enviada');
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─── PATCH /api/adopciones/:id ────────────────────────────────────────────────
// Optimización: si se aprueba, el update de solicitud + mascota ocurre en una
// sola transacción atómica (antes eran dos queries independientes y podían
// quedar inconsistentes si fallaba la segunda).

export const patchSolicitud = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }

    const nuevoEstado = req.body.estado;
    if (nuevoEstado && !['Pendiente', 'Aprobada', 'Rechazada'].includes(nuevoEstado)) {
      badRequest(res, 'Estado inválido. Debe ser "Pendiente", "Aprobada" o "Rechazada"'); return;
    }

    if (nuevoEstado === 'Aprobada') {
      // Transacción atómica: leer solicitud + actualizar solicitud + actualizar mascota
      const [solicitud] = await prisma.$transaction(async (tx) => {
        const existe = await tx.solicitudAdopcion.findUnique({ where: { id } });
        if (!existe) throw { code: 'P2025' };

        const updated = await tx.solicitudAdopcion.update({
          where: { id },
          data: { estado_solicitud: 'Aprobada' },
        });
        await tx.mascota.update({
          where: { id: existe.mascota_id },
          data: { estado_adopcion: 'Adoptado' },
        });
        return [updated];
      });

      invalidateCache(CACHE_KEY);
      invalidateCache('animales'); // el estado de la mascota cambió
      ok(res, solicitud, 'Solicitud aprobada — mascota marcada como adoptada');
      return;
    }

    // Para Pendiente / Rechazada: un solo UPDATE sin fetch previo
    const solicitud = await prisma.solicitudAdopcion.update({
      where: { id },
      data: { ...(nuevoEstado && { estado_solicitud: nuevoEstado }) },
    });

    invalidateCache(CACHE_KEY);
    ok(res, solicitud, 'Solicitud actualizada');
  } catch (error) {
    if ((error as any)?.code === 'P2025') { notFound(res, `Solicitud con id ${req.params.id} no encontrada`); return; }
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─── DELETE /api/adopciones/:id ───────────────────────────────────────────────

export const deleteSolicitud = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }

    await prisma.solicitudAdopcion.delete({ where: { id } });

    invalidateCache(CACHE_KEY);
    noContent(res);
  } catch (error) {
    if ((error as any)?.code === 'P2025') { notFound(res, `Solicitud con id ${req.params.id} no encontrada`); return; }
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};
