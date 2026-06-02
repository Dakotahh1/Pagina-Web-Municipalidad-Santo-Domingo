import { Request, Response } from 'express';
import prisma from '../lib/prismaClient';
import { ok, created, list, badRequest, notFound, noContent, conflict } from '../utils/responseHelper';

// GET /api/adopciones?estado=Pendiente
export const getSolicitudes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { estado } = req.query;
    const solicitudes = await prisma.solicitudAdopcion.findMany({
      where: estado ? { estado_solicitud: String(estado) } : {},
      include: {
        usuario: { select: { nombre_completo: true, correo: true } },
        mascota: { select: { nombre: true, especie: true } },
      },
      orderBy: { fecha_solicitud: 'desc' },
    });
    list(res, solicitudes, solicitudes.length);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// GET /api/adopciones/:id
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

// POST /api/adopciones
export const createSolicitud = async (req: Request, res: Response): Promise<void> => {
  try {
    const { animalId, vecinoTelefono, motivo } = req.body;

    if (!animalId || !vecinoTelefono || !motivo) {
      badRequest(res, 'Faltan campos obligatorios', { required: ['animalId', 'vecinoTelefono', 'motivo'] });
      return;
    }

    const mascota = await prisma.mascota.findUnique({ where: { id: parseInt(animalId) } });
    if (!mascota) { notFound(res, `Animal con id ${animalId} no existe`); return; }
    if (mascota.estado_adopcion !== 'Disponible') {
      conflict(res, `El animal "${mascota.nombre}" no está disponible (estado: ${mascota.estado_adopcion})`);
      return;
    }

    const solicitud = await prisma.solicitudAdopcion.create({
      data: {
        usuario_id: parseInt(req.usuario!.sub),
        mascota_id: mascota.id,
        motivo,
        telefono: vecinoTelefono,
        estado_solicitud: 'Pendiente',
      },
    });
    created(res, solicitud, 'Solicitud de adopción enviada');
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// PATCH /api/adopciones/:id
export const patchSolicitud = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }
    const existe = await prisma.solicitudAdopcion.findUnique({ where: { id } });
    if (!existe) { notFound(res, `Solicitud con id ${id} no encontrada`); return; }

    if (req.body.estado && !['Pendiente', 'Aprobada', 'Rechazada'].includes(req.body.estado)) {
      badRequest(res, 'Estado inválido. Debe ser "Pendiente", "Aprobada" o "Rechazada"');
      return;
    }

    const solicitud = await prisma.solicitudAdopcion.update({
      where: { id },
      data: { ...(req.body.estado && { estado_solicitud: req.body.estado }) },
    });

    // Si fue aprobada, marcar al animal como adoptado
    if (req.body.estado === 'Aprobada') {
      await prisma.mascota.update({
        where: { id: existe.mascota_id },
        data: { estado_adopcion: 'Adoptado' },
      });
    }

    ok(res, solicitud, 'Solicitud actualizada');
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// DELETE /api/adopciones/:id
export const deleteSolicitud = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }
    const existe = await prisma.solicitudAdopcion.findUnique({ where: { id } });
    if (!existe) { notFound(res, `Solicitud con id ${id} no encontrada`); return; }
    await prisma.solicitudAdopcion.delete({ where: { id } });
    noContent(res);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};
