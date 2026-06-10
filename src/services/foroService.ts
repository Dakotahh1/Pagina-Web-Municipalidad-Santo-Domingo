/* Servicio del foro vecinal (EF1 — integración real).
   Lectura pública del feed y publicación para usuarios autenticados. */

import { apiRequest } from './api';

/* Publicación tal como la devuelve el backend (incluye autor y su rol). */
export interface Publicacion {
  id: number;
  titulo: string;
  contenido: string;
  categoria: string; // 'Abandono' | 'Adopcion' | 'Consulta' | 'Reclamo' | 'General'
  fecha_publicacion: string;
  usuario?: { nombre_completo: string; rol?: { nombre: string } };
}

/* GET /api/foro — feed completo, del más reciente al más antiguo. */
export const getPublicaciones = () => apiRequest<Publicacion[]>('/foro');

/* POST /api/foro — crea una publicación a nombre del usuario en sesión. */
export const crearPublicacion = (titulo: string, contenido: string, categoria: string) =>
  apiRequest<Publicacion>('/foro', { method: 'POST', body: { titulo, contenido, categoria } });
