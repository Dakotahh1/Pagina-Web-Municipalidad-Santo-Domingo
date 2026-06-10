import { Request, Response } from 'express';
import prisma from '../lib/prismaClient';
import { ok, created, list, badRequest, notFound, noContent } from '../utils/responseHelper';
import { sanitizeText, sanitizeShort } from '../utils/sanitize';

/* Controlador del foro vecinal (EF1 — CRUD).
   Lectura pública; publicación para cualquier usuario autenticado; moderación
   (eliminar) reservada a funcionarios e inspectores. El texto libre se sanitiza. */

const CATEGORIAS = ['Abandono', 'Adopcion', 'Consulta', 'Reclamo', 'General'];

// GET /api/foro?categoria=Adopcion
export const getPublicaciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoria } = req.query;
    const posts = await prisma.foroPublicacion.findMany({
      where: categoria ? { categoria: String(categoria) } : {},
      include: { usuario: { select: { nombre_completo: true, rol: { select: { nombre: true } } } } },
      orderBy: { fecha_publicacion: 'desc' },
    });
    list(res, posts, posts.length);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// POST /api/foro
export const createPublicacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { titulo, contenido, categoria } = req.body;
    if (!titulo || !contenido) {
      badRequest(res, 'Faltan campos obligatorios', { required: ['titulo', 'contenido'] });
      return;
    }
    const tituloLimpio = sanitizeShort(titulo, 150);
    const contenidoLimpio = sanitizeText(contenido, 2000);
    if (!tituloLimpio || !contenidoLimpio) {
      badRequest(res, 'El contenido no puede quedar vacío tras la validación');
      return;
    }
    const cat = CATEGORIAS.includes(categoria) ? categoria : 'General';

    const post = await prisma.foroPublicacion.create({
      data: {
        usuario_id: parseInt(req.usuario!.sub),
        titulo: tituloLimpio,
        contenido: contenidoLimpio,
        categoria: cat,
      },
      include: { usuario: { select: { nombre_completo: true } } },
    });
    created(res, post, 'Publicación creada');
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};

// DELETE /api/foro/:id — moderación (funcionario/inspector)
export const deletePublicacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { badRequest(res, 'ID inválido'); return; }
    const existe = await prisma.foroPublicacion.findUnique({ where: { id } });
    if (!existe) { notFound(res, `Publicación con id ${id} no encontrada`); return; }
    await prisma.foroPublicacion.delete({ where: { id } });
    noContent(res);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
  }
};
