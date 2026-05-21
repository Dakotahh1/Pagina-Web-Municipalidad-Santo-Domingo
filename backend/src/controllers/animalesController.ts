import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { animalesDb } from '../data/mockData';
import { Animal } from '../types';
import { ok, created, list, badRequest, notFound, noContent } from '../utils/responseHelper';

/*controller de animales. maneja la ficha clínica digital (RF03).
  expone CRUD completo con filtros opcionales por estado y especie*/

// GET /api/animales?estado=Disponible&especie=Perro
export const getAnimales = (req: Request, res: Response): void => {
  const { estado, especie } = req.query;
  let resultado = [...animalesDb];

  if (estado) resultado = resultado.filter(a => a.estado === estado);
  if (especie) resultado = resultado.filter(a => a.especie === especie);

  list(res, resultado, resultado.length);
};

// GET /api/animales/:id
export const getAnimalById = (req: Request, res: Response): void => {
  const animal = animalesDb.find(a => a.id === req.params.id);
  if (!animal) {
    notFound(res, `Animal con id ${req.params.id} no encontrado`);
    return;
  }
  ok(res, animal);
};

// POST /api/animales
export const createAnimal = (req: Request, res: Response): void => {
  const { nombre, especie, raza, sexo, edad } = req.body;

  // Validación de campos obligatorios
  if (!nombre || !especie || !raza || !sexo || edad === undefined) {
    badRequest(res, 'Faltan campos obligatorios', {
      required: ['nombre', 'especie', 'raza', 'sexo', 'edad']
    });
    return;
  }
  if (!['Perro', 'Gato'].includes(especie)) {
    badRequest(res, 'Especie inválida. Debe ser "Perro" o "Gato"');
    return;
  }
  if (!['Macho', 'Hembra'].includes(sexo)) {
    badRequest(res, 'Sexo inválido. Debe ser "Macho" o "Hembra"');
    return;
  }
  if (typeof edad !== 'number' || edad < 0) {
    badRequest(res, 'Edad inválida. Debe ser un número positivo');
    return;
  }

  const ahora = new Date().toISOString();
  const nuevo: Animal = {
    id: uuidv4(),
    nombre, especie, raza, sexo, edad,
    color:    req.body.color    ?? '',
    vacunado: req.body.vacunado ?? false,
    castrado: req.body.castrado ?? false,
    chip:     req.body.chip     ?? null,
    estado:   req.body.estado   ?? 'Disponible',
    notas:    req.body.notas    ?? '',
    imagenes: req.body.imagenes ?? [],
    fechaCreacion: ahora,
    fechaActualizacion: ahora,
  };

  animalesDb.push(nuevo);
  created(res, nuevo, 'Animal registrado exitosamente');
};

// PUT /api/animales/:id — reemplazo completo del recurso
export const replaceAnimal = (req: Request, res: Response): void => {
  const idx = animalesDb.findIndex(a => a.id === req.params.id);
  if (idx === -1) {
    notFound(res, `Animal con id ${req.params.id} no encontrado`);
    return;
  }

  const { nombre, especie, raza, sexo, edad } = req.body;
  if (!nombre || !especie || !raza || !sexo || edad === undefined) {
    badRequest(res, 'PUT requiere TODOS los campos del recurso. Usa PATCH para actualizaciones parciales');
    return;
  }

  const actualizado: Animal = {
    ...animalesDb[idx],
    nombre, especie, raza, sexo, edad,
    color:    req.body.color    ?? '',
    vacunado: req.body.vacunado ?? false,
    castrado: req.body.castrado ?? false,
    chip:     req.body.chip     ?? null,
    estado:   req.body.estado   ?? 'Disponible',
    notas:    req.body.notas    ?? '',
    imagenes: req.body.imagenes ?? [],
    fechaActualizacion: new Date().toISOString(),
  };

  animalesDb[idx] = actualizado;
  ok(res, actualizado, 'Animal actualizado completamente');
};

// PATCH /api/animales/:id — actualización parcial
export const patchAnimal = (req: Request, res: Response): void => {
  const idx = animalesDb.findIndex(a => a.id === req.params.id);
  if (idx === -1) {
    notFound(res, `Animal con id ${req.params.id} no encontrado`);
    return;
  }

  animalesDb[idx] = {
    ...animalesDb[idx],
    ...req.body,
    id: animalesDb[idx].id,                              // proteger id
    fechaCreacion: animalesDb[idx].fechaCreacion,         // proteger fechaCreacion
    fechaActualizacion: new Date().toISOString(),
  };
  ok(res, animalesDb[idx], 'Animal actualizado parcialmente');
};

// DELETE /api/animales/:id
export const deleteAnimal = (req: Request, res: Response): void => {
  const idx = animalesDb.findIndex(a => a.id === req.params.id);
  if (idx === -1) {
    notFound(res, `Animal con id ${req.params.id} no encontrado`);
    return;
  }
  animalesDb.splice(idx, 1);
  noContent(res);
};
