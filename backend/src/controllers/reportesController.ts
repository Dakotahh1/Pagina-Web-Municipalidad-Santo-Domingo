import { Request, Response } from 'express';
import prisma from '../lib/prismaClient';
import { ok, created, list, badRequest, notFound, noContent } from '../utils/responseHelper';
import { sanitizeText, sanitizeShort } from '../utils/sanitize';

// GET /api/reportes?estado=Pendiente&urgente=true
export const getReportes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { estado, urgente } = req.query;
    const reportes = await prisma.reporte.findMany({
      where: {
        ...(estado ? { estado: String(estado) } : {}),
        ...(urgente !== undefined ? { urgente: urgente === 'true' } : {}),
      },
      include: { usuario: { select: { nombre_completo: true, correo: true } } },
      orderBy: { fecha_creacion: 'desc' },
    });
    list(res, reportes, reportes.length);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// GET /api/reportes/:id
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

// POST /api/reportes
export const createReporte = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tipo, descripcion, ubicacion } = req.body;

    if (!tipo || !descripcion || !ubicacion) {
      badRequest(res, 'Faltan campos obligatorios', { required: ['tipo', 'descripcion', 'ubicacion'] });
      return;
    }
    const tiposValidos = ['Abandono', 'Animal herido', 'Animal muerto', 'Mordedura', 'Tenencia irresponsable', 'Otro'];
    if (!tiposValidos.includes(tipo)) {
      badRequest(res, `Tipo inválido. Debe ser uno de: ${tiposValidos.join(', ')}`);
      return;
    }
    if (typeof ubicacion.lat !== 'number' || typeof ubicacion.lng !== 'number' || !ubicacion.sector) {
      badRequest(res, 'Ubicación inválida. Requiere { lat, lng, sector }');
      return;
    }

    // Sanitiza el texto libre antes de persistir (anti-XSS almacenado — EF3).
    const descripcionLimpia = sanitizeText(descripcion, 1000);
    if (!descripcionLimpia) {
      badRequest(res, 'La descripción no puede quedar vacía tras la validación');
      return;
    }

    const reporte = await prisma.reporte.create({
      data: {
        usuario_id: parseInt(req.usuario!.sub),
        tipo_incidente: tipo,
        descripcion: descripcionLimpia,
        latitud: ubicacion.lat,
        longitud: ubicacion.lng,
        sector: sanitizeShort(ubicacion.sector, 120),
        urgente: req.body.urgente ?? false,
        estado: 'Pendiente',
        fotos: req.body.fotos ?? [],
      },
    });
    created(res, reporte, 'Reporte recibido. La municipalidad lo revisará en 24-48 hrs');
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// PATCH /api/reportes/:id
export const patchReporte = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }
    const existe = await prisma.reporte.findUnique({ where: { id } });
    if (!existe) { notFound(res, `Reporte con id ${id} no encontrado`); return; }

    if (req.body.estado) {
      const estadosValidos = ['Pendiente', 'En proceso', 'Resuelto', 'Cerrado'];
      if (!estadosValidos.includes(req.body.estado)) {
        badRequest(res, `Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}`);
        return;
      }
    }

    const reporte = await prisma.reporte.update({
      where: { id },
      data: {
        ...(req.body.estado              && { estado: req.body.estado }),
        ...(req.body.inspector_asignado  && { inspector_asignado: req.body.inspector_asignado }),
        ...(req.body.urgente !== undefined && { urgente: req.body.urgente }),
      },
    });
    ok(res, reporte, 'Reporte actualizado');
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// DELETE /api/reportes/:id
export const deleteReporte = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }
    const existe = await prisma.reporte.findUnique({ where: { id } });
    if (!existe) { notFound(res, `Reporte con id ${id} no encontrado`); return; }
    await prisma.reporte.delete({ where: { id } });
    noContent(res);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};
