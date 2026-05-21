import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { operativosDb } from '../data/mockData';
import { Operativo } from '../types';
import { ok, created, list, badRequest, notFound, noContent } from '../utils/responseHelper';

/*controller de operativos municipales (RF04).
  los funcionarios crean y gestionan operativos de vacunación, esterilización y chipeo*/

// GET /api/operativos?estado=Programado
export const getOperativos = (req: Request, res: Response): void => {
  const { estado, tipo } = req.query;
  let resultado = [...operativosDb];
  if (estado) resultado = resultado.filter(o => o.estado === estado);
  if (tipo)   resultado = resultado.filter(o => o.tipo === tipo);
  list(res, resultado, resultado.length);
};

// GET /api/operativos/:id
export const getOperativoById = (req: Request, res: Response): void => {
  const operativo = operativosDb.find(o => o.id === req.params.id);
  if (!operativo) {
    notFound(res, `Operativo con id ${req.params.id} no encontrado`);
    return;
  }
  ok(res, operativo);
};

// POST /api/operativos
export const createOperativo = (req: Request, res: Response): void => {
  const { titulo, tipo, fecha, hora, ubicacion, cupos } = req.body;

  if (!titulo || !tipo || !fecha || !hora || !ubicacion || cupos === undefined) {
    badRequest(res, 'Faltan campos obligatorios', {
      required: ['titulo', 'tipo', 'fecha', 'hora', 'ubicacion', 'cupos']
    });
    return;
  }
  if (!['Vacunación', 'Esterilización', 'Chipeo', 'Mixto'].includes(tipo)) {
    badRequest(res, 'Tipo inválido. Debe ser "Vacunación", "Esterilización", "Chipeo" o "Mixto"');
    return;
  }
  if (typeof cupos !== 'number' || cupos < 1) {
    badRequest(res, 'Cupos debe ser un número mayor a 0');
    return;
  }

  const ahora = new Date().toISOString();
  const nuevo: Operativo = {
    id: uuidv4(),
    titulo, tipo, fecha, hora, ubicacion, cupos,
    cuposDisponibles: cupos,
    descripcion: req.body.descripcion ?? '',
    estado: 'Programado',
    fechaCreacion: ahora,
    fechaActualizacion: ahora,
  };
  operativosDb.push(nuevo);
  created(res, nuevo, 'Operativo creado exitosamente');
};

// PUT /api/operativos/:id
export const replaceOperativo = (req: Request, res: Response): void => {
  const idx = operativosDb.findIndex(o => o.id === req.params.id);
  if (idx === -1) {
    notFound(res, `Operativo con id ${req.params.id} no encontrado`);
    return;
  }
  const { titulo, tipo, fecha, hora, ubicacion, cupos } = req.body;
  if (!titulo || !tipo || !fecha || !hora || !ubicacion || cupos === undefined) {
    badRequest(res, 'PUT requiere TODOS los campos del recurso');
    return;
  }
  operativosDb[idx] = {
    ...operativosDb[idx],
    titulo, tipo, fecha, hora, ubicacion, cupos,
    cuposDisponibles: req.body.cuposDisponibles ?? cupos,
    descripcion: req.body.descripcion ?? '',
    estado: req.body.estado ?? operativosDb[idx].estado,
    fechaActualizacion: new Date().toISOString(),
  };
  ok(res, operativosDb[idx], 'Operativo actualizado completamente');
};

// PATCH /api/operativos/:id
export const patchOperativo = (req: Request, res: Response): void => {
  const idx = operativosDb.findIndex(o => o.id === req.params.id);
  if (idx === -1) {
    notFound(res, `Operativo con id ${req.params.id} no encontrado`);
    return;
  }
  operativosDb[idx] = {
    ...operativosDb[idx],
    ...req.body,
    id: operativosDb[idx].id,
    fechaCreacion: operativosDb[idx].fechaCreacion,
    fechaActualizacion: new Date().toISOString(),
  };
  ok(res, operativosDb[idx], 'Operativo actualizado parcialmente');
};

// DELETE /api/operativos/:id
export const deleteOperativo = (req: Request, res: Response): void => {
  const idx = operativosDb.findIndex(o => o.id === req.params.id);
  if (idx === -1) {
    notFound(res, `Operativo con id ${req.params.id} no encontrado`);
    return;
  }
  operativosDb.splice(idx, 1);
  noContent(res);
};
