/**
 * reportesController.ts — OPTIMIZADO
 * ─────────────────────────────────────
 * Cambios respecto al original:
 *
 * 1. PAGINACIÓN  — ?page y ?limit para no traer todos los reportes.
 * 2. SELECT EXPLÍCITO en el listado — no se incluye descripción completa
 *    (puede ser larga); solo campos del panel de gestión.
 * 3. DOUBLE-FETCH ELIMINADO — patchReporte y deleteReporte usan una sola
 *    query; P2025 → 404.
 * 4. INVALIDACIÓN DE CACHÉ tras mutaciones.
 */

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prismaClient';
import { ok, created, list, badRequest, notFound, noContent } from '../utils/responseHelper';
import { sanitizeText, sanitizeShort } from '../utils/sanitize';
import { invalidateCache } from '../middlewares/cacheMiddleware';

const CACHE_KEY = 'reportes';
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

const LISTADO_SELECT = {
  id: true,
  tipo_incidente: true,
  sector: true,
  urgente: true,
  estado: true,
  inspector_asignado: true,
  fecha_creacion: true,
  usuario: { select: { nombre_completo: true, correo: true } },
} satisfies Prisma.ReporteSelect;

// ─── GET /api/reportes?estado=Pendiente&urgente=true&page=1&limit=20 ──────────

export const getReportes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { estado, urgente } = req.query;

    const page  = Math.max(1, parseInt(String(req.query.page  ?? '1')));
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(String(req.query.limit ?? String(DEFAULT_PAGE_SIZE)))));
    const skip  = (page - 1) * limit;

    const where: Prisma.ReporteWhereInput = {
      ...(estado  ? { estado:  String(estado) } : {}),
      ...(urgente !== undefined ? { urgente: urgente === 'true' } : {}),
    };

    const [total, reportes] = await prisma.$transaction([
      prisma.reporte.count({ where }),
      prisma.reporte.findMany({
        where,
        select: LISTADO_SELECT,
        orderBy: { fecha_creacion: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    list(res, reportes, total, { page, limit, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─── GET /api/reportes/:id ────────────────────────────────────────────────────

export const getReporteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }

    const reporte = await prisma.reporte.findUnique({
      where: { id },
      include: { usuario: { select: { nombre_completo: true, correo: true } } },
    });
    if (!reporte) { notFound(res, `Reporte con id ${id} no encontrado`); return; }

    ok(res, reporte);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─── POST /api/reportes ───────────────────────────────────────────────────────

export const createReporte = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tipo, descripcion, ubicacion } = req.body;

    if (!tipo || !descripcion || !ubicacion) {
      badRequest(res, 'Faltan campos obligatorios', { required: ['tipo', 'descripcion', 'ubicacion'] }); return;
    }
    const tiposValidos = ['Abandono', 'Animal herido', 'Animal muerto', 'Mordedura', 'Tenencia irresponsable', 'Otro'];
    if (!tiposValidos.includes(tipo)) {
      badRequest(res, `Tipo inválido. Debe ser uno de: ${tiposValidos.join(', ')}`); return;
    }
    if (typeof ubicacion.lat !== 'number' || typeof ubicacion.lng !== 'number' || !ubicacion.sector) {
      badRequest(res, 'Ubicación inválida. Requiere { lat, lng, sector }'); return;
    }

    // Sanitiza el texto libre antes de persistir (anti-XSS almacenado — EF3).
    const descripcionLimpia = sanitizeText(descripcion, 1000);
    if (!descripcionLimpia) {
      badRequest(res, 'La descripción no puede quedar vacía tras la validación');
      return;
    }

    const reporte = await prisma.reporte.create({
      data: {
        usuario_id:     parseInt(req.usuario!.sub),
        tipo_incidente: tipo,
        descripcion:    descripcionLimpia,
        latitud:        ubicacion.lat,
        longitud:       ubicacion.lng,
        sector:         sanitizeShort(ubicacion.sector, 120),
        urgente:        req.body.urgente ?? false,
        estado:         'Pendiente',
        fotos:          req.body.fotos ?? [],
      },
    });

    invalidateCache(CACHE_KEY);
    created(res, reporte, 'Reporte recibido. La municipalidad lo revisará en 24-48 hrs');
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─── PATCH /api/reportes/:id — un solo UPDATE, sin double-fetch ───────────────

export const patchReporte = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }

    if (req.body.estado) {
      const estadosValidos = ['Pendiente', 'En proceso', 'Resuelto', 'Cerrado'];
      if (!estadosValidos.includes(req.body.estado)) {
        badRequest(res, `Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}`); return;
      }
    }

    const reporte = await prisma.reporte.update({
      where: { id },
      data: {
        ...(req.body.estado             !== undefined && { estado:             req.body.estado             }),
        ...(req.body.inspector_asignado !== undefined && { inspector_asignado: req.body.inspector_asignado }),
        ...(req.body.urgente            !== undefined && { urgente:            req.body.urgente            }),
      },
    });

    invalidateCache(CACHE_KEY);
    ok(res, reporte, 'Reporte actualizado');
  } catch (error) {
    if ((error as any)?.code === 'P2025') { notFound(res, `Reporte con id ${req.params.id} no encontrado`); return; }
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// ─── DELETE /api/reportes/:id ─────────────────────────────────────────────────

export const deleteReporte = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }

    await prisma.reporte.delete({ where: { id } });

    invalidateCache(CACHE_KEY);
    noContent(res);
  } catch (error) {
    if ((error as any)?.code === 'P2025') { notFound(res, `Reporte con id ${req.params.id} no encontrado`); return; }
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};
