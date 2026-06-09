/**
 * responseHelper.ts — ACTUALIZADO
 * ─────────────────────────────────
 * Se agrega un cuarto parámetro opcional `pagination` a list() para que
 * los listados paginados devuelvan metadata de navegación junto a los datos.
 *
 * Respuesta paginada:
 * {
 *   success: true,
 *   data: [...],
 *   total: 87,
 *   pagination: { page: 2, limit: 20, pages: 5 }
 * }
 */

import { Response } from 'express';

interface PaginationMeta {
  page:  number;
  limit: number;
  pages: number;
}

export const ok = (res: Response, data: unknown, message?: string) =>
  res.status(200).json({ success: true, data, ...(message && { message }) });

export const created = (res: Response, data: unknown, message?: string) =>
  res.status(201).json({ success: true, data, ...(message && { message }) });

export const list = (
  res: Response,
  data: unknown,
  total: number,
  pagination?: PaginationMeta,
) =>
  res.status(200).json({
    success: true,
    data,
    total,
    ...(pagination && { pagination }),
  });

export const noContent = (res: Response) =>
  res.status(204).send();

export const badRequest = (res: Response, message: string, details?: unknown) =>
  res.status(400).json({
    success: false,
    error: { code: 'BAD_REQUEST', message, ...(details && { details }) },
  });

export const unauthorized = (res: Response, message = 'No autorizado') =>
  res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message } });

export const notFound = (res: Response, message: string) =>
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message } });

export const conflict = (res: Response, message: string) =>
  res.status(409).json({ success: false, error: { code: 'CONFLICT', message } });
