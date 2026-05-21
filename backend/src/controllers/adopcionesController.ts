import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { adopcionesDb, animalesDb } from '../data/mockData';
import { SolicitudAdopcion } from '../types';
import { ok, created, list, badRequest, notFound, noContent, conflict } from '../utils/responseHelper';

/*controller de solicitudes de adopción (RF02).
  los vecinos crean solicitudes asociadas a un animal disponible.
  los funcionarios las aprueban o rechazan*/

// GET /api/adopciones?estado=Pendiente
export const getSolicitudes = (req: Request, res: Response): void => {
  const { estado } = req.query;
  let resultado = [...adopcionesDb];
  if (estado) resultado = resultado.filter(s => s.estado === estado);
  list(res, resultado, resultado.length);
};

// GET /api/adopciones/:id
export const getSolicitudById = (req: Request, res: Response): void => {
  const solicitud = adopcionesDb.find(s => s.id === req.params.id);
  if (!solicitud) {
    notFound(res, `Solicitud con id ${req.params.id} no encontrada`);
    return;
  }
  ok(res, solicitud);
};

// POST /api/adopciones
export const createSolicitud = (req: Request, res: Response): void => {
  const { animalId, vecinoRut, vecinoNombre, vecinoTelefono, motivo } = req.body;

  if (!animalId || !vecinoRut || !vecinoNombre || !vecinoTelefono || !motivo) {
    badRequest(res, 'Faltan campos obligatorios', {
      required: ['animalId', 'vecinoRut', 'vecinoNombre', 'vecinoTelefono', 'motivo']
    });
    return;
  }

  // Validar que el animal exista y esté disponible
  const animal = animalesDb.find(a => a.id === animalId);
  if (!animal) {
    notFound(res, `El animal con id ${animalId} no existe`);
    return;
  }
  if (animal.estado !== 'Disponible') {
    conflict(res, `El animal "${animal.nombre}" no está disponible para adopción (estado: ${animal.estado})`);
    return;
  }

  const ahora = new Date().toISOString();
  const nueva: SolicitudAdopcion = {
    id: uuidv4(),
    animalId, vecinoRut, vecinoNombre, vecinoTelefono, motivo,
    estado: 'Pendiente',
    fechaCreacion: ahora,
    fechaActualizacion: ahora,
  };
  adopcionesDb.push(nueva);
  created(res, nueva, 'Solicitud de adopción enviada');
};

// PATCH /api/adopciones/:id
export const patchSolicitud = (req: Request, res: Response): void => {
  const idx = adopcionesDb.findIndex(s => s.id === req.params.id);
  if (idx === -1) {
    notFound(res, `Solicitud con id ${req.params.id} no encontrada`);
    return;
  }

  if (req.body.estado && !['Pendiente', 'Aprobada', 'Rechazada'].includes(req.body.estado)) {
    badRequest(res, 'Estado inválido. Debe ser "Pendiente", "Aprobada" o "Rechazada"');
    return;
  }

  adopcionesDb[idx] = {
    ...adopcionesDb[idx],
    ...req.body,
    id: adopcionesDb[idx].id,
    fechaCreacion: adopcionesDb[idx].fechaCreacion,
    fechaActualizacion: new Date().toISOString(),
  };

  // Si fue aprobada, marcar al animal como adoptado
  if (req.body.estado === 'Aprobada') {
    const animalIdx = animalesDb.findIndex(a => a.id === adopcionesDb[idx].animalId);
    if (animalIdx !== -1) {
      animalesDb[animalIdx].estado = 'Adoptado';
      animalesDb[animalIdx].fechaActualizacion = new Date().toISOString();
    }
  }

  ok(res, adopcionesDb[idx], 'Solicitud actualizada');
};

// DELETE /api/adopciones/:id
export const deleteSolicitud = (req: Request, res: Response): void => {
  const idx = adopcionesDb.findIndex(s => s.id === req.params.id);
  if (idx === -1) {
    notFound(res, `Solicitud con id ${req.params.id} no encontrada`);
    return;
  }
  adopcionesDb.splice(idx, 1);
  noContent(res);
};
