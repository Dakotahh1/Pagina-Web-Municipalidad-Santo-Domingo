import { Request, Response } from 'express';
import prisma from '../lib/prismaClient';
import { ok, created, list, badRequest, notFound, noContent } from '../utils/responseHelper';

// GET /api/animales?estado=Disponible&especie=Perro
export const getAnimales = async (req: Request, res: Response): Promise<void> => {
  try {
    const { estado, especie } = req.query;
    const mascotas = await prisma.mascota.findMany({
      where: {
        ...(estado ? { estado_adopcion: String(estado) } : {}),
        ...(especie ? { especie: String(especie) } : {}),
      },
      orderBy: { fecha_creacion: 'desc' },
    });
    list(res, mascotas, mascotas.length);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// GET /api/animales/:id
export const getAnimalById = async (req: Request, res: Response): Promise<void> => {
  try {
    const mascota = await prisma.mascota.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!mascota) {
      notFound(res, `Animal con id ${req.params.id} no encontrado`);
      return;
    }
    ok(res, mascota);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// POST /api/animales
export const createAnimal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, especie, raza, sexo, edad } = req.body;

    if (!nombre || !especie || !raza || !sexo || edad === undefined) {
      badRequest(res, 'Faltan campos obligatorios', { required: ['nombre', 'especie', 'raza', 'sexo', 'edad'] });
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

    const mascota = await prisma.mascota.create({
      data: {
        nombre, especie, raza, sexo, edad: parseInt(edad),
        color:          req.body.color    ?? '',
        vacunado:       req.body.vacunado ?? false,
        castrado:       req.body.castrado ?? false,
        chip:           req.body.chip     ?? null,
        descripcion:    req.body.notas    ?? '',
        estado_adopcion: req.body.estado  ?? 'Disponible',
        imagenes:       req.body.imagenes ?? [],
      },
    });
    created(res, mascota, 'Animal registrado exitosamente');
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// PATCH /api/animales/:id
export const patchAnimal = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const existe = await prisma.mascota.findUnique({ where: { id } });
    if (!existe) {
      notFound(res, `Animal con id ${id} no encontrado`);
      return;
    }
    const mascota = await prisma.mascota.update({
      where: { id },
      data: {
        ...(req.body.nombre     && { nombre: req.body.nombre }),
        ...(req.body.especie    && { especie: req.body.especie }),
        ...(req.body.raza       && { raza: req.body.raza }),
        ...(req.body.sexo       && { sexo: req.body.sexo }),
        ...(req.body.edad       !== undefined && { edad: req.body.edad }),
        ...(req.body.color      !== undefined && { color: req.body.color }),
        ...(req.body.vacunado   !== undefined && { vacunado: req.body.vacunado }),
        ...(req.body.castrado   !== undefined && { castrado: req.body.castrado }),
        ...(req.body.chip       !== undefined && { chip: req.body.chip }),
        ...(req.body.estado     && { estado_adopcion: req.body.estado }),
        ...(req.body.notas      && { descripcion: req.body.notas }),
      },
    });
    ok(res, mascota, 'Animal actualizado');
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// PUT /api/animales/:id
export const replaceAnimal = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, especie, raza, sexo, edad } = req.body;
    if (!nombre || !especie || !raza || !sexo || edad === undefined) {
      badRequest(res, 'PUT requiere TODOS los campos del recurso');
      return;
    }
    const existe = await prisma.mascota.findUnique({ where: { id } });
    if (!existe) { notFound(res, `Animal con id ${id} no encontrado`); return; }

    const mascota = await prisma.mascota.update({
      where: { id },
      data: { nombre, especie, raza, sexo, edad, color: req.body.color ?? '', vacunado: req.body.vacunado ?? false, castrado: req.body.castrado ?? false, chip: req.body.chip ?? null, descripcion: req.body.notas ?? '', estado_adopcion: req.body.estado ?? 'Disponible' },
    });
    ok(res, mascota, 'Animal actualizado completamente');
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// DELETE /api/animales/:id
export const deleteAnimal = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const existe = await prisma.mascota.findUnique({ where: { id } });
    if (!existe) { notFound(res, `Animal con id ${id} no encontrado`); return; }
    await prisma.mascota.delete({ where: { id } });
    noContent(res);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};
