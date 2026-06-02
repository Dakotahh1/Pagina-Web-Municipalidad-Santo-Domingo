import { Request, Response } from 'express';
import prisma from '../lib/prismaClient';
import { ok, created, list, badRequest, notFound, noContent } from '../utils/responseHelper';

// GET /api/operativos?estado=Programado&tipo=Vacunación
export const getOperativos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { estado, tipo } = req.query;
    const operativos = await prisma.operativo.findMany({
      where: {
        ...(estado ? { estado: String(estado) } : {}),
        ...(tipo   ? { tipo:   String(tipo)   } : {}),
      },
      orderBy: { fecha_evento: 'asc' },
    });
    list(res, operativos, operativos.length);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// GET /api/operativos/:id
export const getOperativoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }
    const operativo = await prisma.operativo.findUnique({
      where: { id },
      include: { inscripciones: { include: { usuario: { select: { nombre_completo: true } } } } },
    });
    if (!operativo) { notFound(res, `Operativo con id ${id} no encontrado`); return; }
    ok(res, operativo);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// POST /api/operativos
export const createOperativo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { titulo, tipo, fecha, hora, ubicacion, cupos } = req.body;
    if (!titulo || !tipo || !fecha || !hora || !ubicacion || cupos === undefined) {
      badRequest(res, 'Faltan campos obligatorios', { required: ['titulo', 'tipo', 'fecha', 'hora', 'ubicacion', 'cupos'] });
      return;
    }
    if (!['Vacunación', 'Esterilización', 'Chipeo', 'Mixto'].includes(tipo)) {
      badRequest(res, 'Tipo inválido. Debe ser "Vacunación", "Esterilización", "Chipeo" o "Mixto"');
      return;
    }

    const operativo = await prisma.operativo.create({
      data: {
        titulo, tipo, hora, ubicacion,
        descripcion: req.body.descripcion ?? '',
        fecha_evento: new Date(fecha),
        cupos_totales: parseInt(cupos),
        cupos_disponibles: parseInt(cupos),
        estado: 'Programado',
      },
    });
    created(res, operativo, 'Operativo creado exitosamente');
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// PATCH /api/operativos/:id
export const patchOperativo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }
    const existe = await prisma.operativo.findUnique({ where: { id } });
    if (!existe) { notFound(res, `Operativo con id ${id} no encontrado`); return; }

    const operativo = await prisma.operativo.update({
      where: { id },
      data: {
        ...(req.body.titulo              && { titulo: req.body.titulo }),
        ...(req.body.estado              && { estado: req.body.estado }),
        ...(req.body.cuposDisponibles !== undefined && { cupos_disponibles: req.body.cuposDisponibles }),
        ...(req.body.descripcion         && { descripcion: req.body.descripcion }),
      },
    });
    ok(res, operativo, 'Operativo actualizado');
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// PUT /api/operativos/:id
export const replaceOperativo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }
    const { titulo, tipo, fecha, hora, ubicacion, cupos } = req.body;
    if (!titulo || !tipo || !fecha || !hora || !ubicacion || cupos === undefined) {
      badRequest(res, 'PUT requiere TODOS los campos del recurso');
      return;
    }
    const existe = await prisma.operativo.findUnique({ where: { id } });
    if (!existe) { notFound(res, `Operativo con id ${id} no encontrado`); return; }

    const operativo = await prisma.operativo.update({
      where: { id },
      data: { titulo, tipo, hora, ubicacion, fecha_evento: new Date(fecha), cupos_totales: parseInt(cupos), cupos_disponibles: req.body.cuposDisponibles ?? parseInt(cupos), descripcion: req.body.descripcion ?? '', estado: req.body.estado ?? existe.estado },
    });
    ok(res, operativo, 'Operativo actualizado completamente');
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// DELETE /api/operativos/:id
export const deleteOperativo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }
    const existe = await prisma.operativo.findUnique({ where: { id } });
    if (!existe) { notFound(res, `Operativo con id ${id} no encontrado`); return; }
    await prisma.operativo.delete({ where: { id } });
    noContent(res);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};
