/* Servicio de reportes (EF1 — CRUD completo).
   Consume el recurso /api/reportes del backend. La creación está disponible para
   cualquier vecino autenticado; el listado, la actualización de estado y la
   eliminación están restringidos a funcionarios e inspectores (control en backend). */

import { apiRequest } from './api';

/* Reporte tal como lo devuelve el backend (incluye datos del vecino autor). */
export interface Reporte {
  id: number;
  tipo_incidente: string;
  descripcion: string;
  sector: string;
  latitud: number;
  longitud: number;
  urgente: boolean;
  estado: string;
  inspector_asignado: string | null;
  fecha_creacion: string;
  usuario?: { nombre_completo: string; correo: string };
}

/* Cuerpo para crear un nuevo reporte. */
export interface NuevoReporte {
  tipo: string;
  descripcion: string;
  ubicacion: { lat: number; lng: number; sector: string };
  urgente?: boolean;
}

/* GET /api/reportes — listado completo (funcionario/inspector). */
export const getReportes = () => apiRequest<Reporte[]>('/reportes');

/* POST /api/reportes — el vecino crea un reporte. */
export const crearReporte = (data: NuevoReporte) =>
  apiRequest<Reporte>('/reportes', { method: 'POST', body: data });

/* PATCH /api/reportes/:id — actualiza el estado de un reporte. */
export const actualizarEstadoReporte = (id: number, estado: string) =>
  apiRequest<Reporte>(`/reportes/${id}`, { method: 'PATCH', body: { estado } });

/* DELETE /api/reportes/:id — elimina un reporte. */
export const eliminarReporte = (id: number) =>
  apiRequest<void>(`/reportes/${id}`, { method: 'DELETE' });
