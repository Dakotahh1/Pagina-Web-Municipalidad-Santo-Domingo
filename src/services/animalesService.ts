/* Servicio de animales (EP 2.4 — consumo de la API REST con GET).
   Consume el endpoint público `GET /api/animales` del backend, que lee las
   mascotas desde PostgreSQL mediante Prisma. */

import { apiRequest } from './api';

/* Mascota tal como la devuelve el backend (tabla Mascota de PostgreSQL). */
export interface Animal {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  edad: number;
  color: string;
  vacunado: boolean;
  castrado: boolean;
  chip: string | null;
  descripcion: string;
  estado_adopcion: string;
  imagenes: string[];
}

/* Forma simplificada que consumen las tarjetas de la vista de Adopciones. */
export interface AnimalCard {
  id: number;
  nombre: string;
  tipo: string;
  detalles: string;
  etiquetas: string[];
  urgente: boolean;
  imagen: string;
}

/* GET /api/animales — listado completo de mascotas. */
export const getAnimales = (): Promise<Animal[]> => apiRequest<Animal[]>('/animales');

/* GET /api/animales/:id — ficha de una mascota concreta. */
export const getAnimalById = (id: number): Promise<Animal> => apiRequest<Animal>(`/animales/${id}`);

/* Adapta una mascota del backend a las props que renderiza la tarjeta de adopción. */
export const toCard = (a: Animal): AnimalCard => ({
  id: a.id,
  nombre: a.nombre,
  tipo: a.especie,
  detalles: `${a.especie} ${a.raza} · ${a.edad} ${a.edad === 1 ? 'año' : 'años'} · ${a.sexo}`,
  etiquetas: [a.vacunado && 'Vacunado', a.castrado && 'Castrado'].filter(Boolean) as string[],
  // Un animal "En tratamiento" se resalta como caso urgente en la grilla.
  urgente: a.estado_adopcion === 'En tratamiento',
  imagen: a.imagenes[0] ?? '',
});
