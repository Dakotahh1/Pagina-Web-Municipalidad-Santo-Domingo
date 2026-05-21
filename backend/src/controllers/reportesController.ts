import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { reportesDb } from '../data/mockData';
import { Reporte } from '../types';
import { ok, created, list, badRequest, notFound, noContent } from '../utils/responseHelper';

/*controller de reportes ciudadanos (RF01).
  los vecinos crean reportes (POST), los inspectores cambian el estado (PATCH)*/

// GET /api/reportes?estado=Pendiente&urgente=true
export const getReportes = (req: Request, res: Response): void => {
  const { estado, urgente } = req.query;
  let resultado = [...reportesDb];

  if (estado) resultado = resultado.filter(r => r.estado === estado);
  if (urgente !== undefined) {
    const flag = urgente === 'true';
    resultado = resultado.filter(r => r.urgente === flag);
  }

  list(res, resultado, resultado.length);
};

// GET /api/reportes/:id
export const getReporteById = (req: Request, res: Response): void => {
  const reporte = reportesDb.find(r => r.id === req.params.id);
  if (!reporte) {
    notFound(res, `Reporte con id ${req.params.id} no encontrado`);
    return;
  }
  ok(res, reporte);
};

// POST /api/reportes
export const createReporte = (req: Request, res: Response): void => {
  const { vecinoRut, tipo, descripcion, ubicacion } = req.body;

  if (!vecinoRut || !tipo || !descripcion || !ubicacion) {
    badRequest(res, 'Faltan campos obligatorios', {
      required: ['vecinoRut', 'tipo', 'descripcion', 'ubicacion']
    });
    return;
  }
  const tiposValidos = ['Abandono', 'Animal herido', 'Mordedura', 'Tenencia irresponsable'];
  if (!tiposValidos.includes(tipo)) {
    badRequest(res, `Tipo inválido. Debe ser uno de: ${tiposValidos.join(', ')}`);
    return;
  }
  if (typeof ubicacion.lat !== 'number' || typeof ubicacion.lng !== 'number' || !ubicacion.sector) {
    badRequest(res, 'Ubicación inválida. Requiere { lat: number, lng: number, sector: string }');
    return;
  }

  const ahora = new Date().toISOString();
  const nuevo: Reporte = {
    id: uuidv4(),
    vecinoRut, tipo, descripcion, ubicacion,
    urgente:           req.body.urgente ?? false,
    estado:            'Pendiente',
    fotos:             req.body.fotos ?? [],
    inspectorAsignado: null,
    fechaCreacion: ahora,
    fechaActualizacion: ahora,
  };
  reportesDb.push(nuevo);
  created(res, nuevo, 'Reporte recibido. La municipalidad lo revisará en 24-48 hrs');
};

// PATCH /api/reportes/:id
export const patchReporte = (req: Request, res: Response): void => {
  const idx = reportesDb.findIndex(r => r.id === req.params.id);
  if (idx === -1) {
    notFound(res, `Reporte con id ${req.params.id} no encontrado`);
    return;
  }

  if (req.body.estado) {
    const estadosValidos = ['Pendiente', 'En proceso', 'Resuelto', 'Cerrado'];
    if (!estadosValidos.includes(req.body.estado)) {
      badRequest(res, `Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}`);
      return;
    }
  }

  reportesDb[idx] = {
    ...reportesDb[idx],
    ...req.body,
    id: reportesDb[idx].id,
    fechaCreacion: reportesDb[idx].fechaCreacion,
    fechaActualizacion: new Date().toISOString(),
  };
  ok(res, reportesDb[idx], 'Reporte actualizado');
};

// DELETE /api/reportes/:id
export const deleteReporte = (req: Request, res: Response): void => {
  const idx = reportesDb.findIndex(r => r.id === req.params.id);
  if (idx === -1) {
    notFound(res, `Reporte con id ${req.params.id} no encontrado`);
    return;
  }
  reportesDb.splice(idx, 1);
  noContent(res);
};
