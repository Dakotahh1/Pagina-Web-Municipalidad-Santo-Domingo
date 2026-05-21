import { Response } from 'express';
import { ApiResponse } from '../types';

/*helpers que centralizan la estructura de las respuestas JSON.
  asegura consistencia en TODOS los endpoints sin repetir el shape en cada controller*/

export const ok = <T>(res: Response, data: T, message?: string): void => {
  const body: ApiResponse<T> = { success: true, data, message };
  res.status(200).json(body);
};

export const created = <T>(res: Response, data: T, message = 'Recurso creado exitosamente'): void => {
  const body: ApiResponse<T> = { success: true, data, message };
  res.status(201).json(body);
};

export const noContent = (res: Response): void => {
  res.status(204).send();
};

export const list = <T>(res: Response, data: T[], total: number, page = 1, limit = 10): void => {
  const body: ApiResponse<T[]> = { success: true, data, meta: { total, page, limit } };
  res.status(200).json(body);
};

export const badRequest = (res: Response, message: string, details?: unknown): void => {
  const body: ApiResponse = { success: false, error: { code: 'BAD_REQUEST', message, details } };
  res.status(400).json(body);
};

export const notFound = (res: Response, message = 'Recurso no encontrado'): void => {
  const body: ApiResponse = { success: false, error: { code: 'NOT_FOUND', message } };
  res.status(404).json(body);
};

export const conflict = (res: Response, message: string): void => {
  const body: ApiResponse = { success: false, error: { code: 'CONFLICT', message } };
  res.status(409).json(body);
};

export const unauthorized = (res: Response, message = 'No autorizado'): void => {
  const body: ApiResponse = { success: false, error: { code: 'UNAUTHORIZED', message } };
  res.status(401).json(body);
};
