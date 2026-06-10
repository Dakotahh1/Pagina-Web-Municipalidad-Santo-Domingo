/* Servicio de operativos municipales (EF1 — integración real).
   Lista los operativos desde PostgreSQL y permite al vecino autenticado
   inscribirse (el backend decrementa los cupos de forma atómica — RF-04). */

import { apiRequest } from './api';

/* Operativo tal como lo devuelve el backend (tabla Operativo). */
export interface Operativo {
  id: number;
  titulo: string;
  tipo: string;
  descripcion: string;
  fecha_evento: string;
  hora: string;
  ubicacion: string;
  cupos_totales: number;
  cupos_disponibles: number;
  estado: string; // 'Programado' | 'En curso' | 'Finalizado'
}

/* GET /api/operativos — listado completo (público). */
export const getOperativos = () => apiRequest<Operativo[]>('/operativos');

/* POST /api/operativos/:id/inscribir — inscribe al vecino en sesión.
   Devuelve los cupos restantes tras el decremento atómico. */
export const inscribirseOperativo = (id: number) =>
  apiRequest<{ cupos_disponibles: number }>(`/operativos/${id}/inscribir`, { method: 'POST' });
