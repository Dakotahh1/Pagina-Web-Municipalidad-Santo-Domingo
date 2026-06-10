/* Servicio de solicitudes de adopción (EF1 — integración real).
   El vecino autenticado postula a un animal; el backend valida que la mascota
   exista y esté disponible (responde 409 en caso contrario). */

import { apiRequest } from './api';

export interface SolicitudAdopcion {
  id: number;
  mascota_id: number;
  motivo: string;
  telefono: string;
  estado_solicitud: string;
  fecha_solicitud: string;
}

/* POST /api/adopciones — envía la solicitud del vecino en sesión. */
export const solicitarAdopcion = (animalId: number, telefono: string, motivo: string) =>
  apiRequest<SolicitudAdopcion>('/adopciones', {
    method: 'POST',
    body: { animalId, vecinoTelefono: telefono, motivo },
  });
