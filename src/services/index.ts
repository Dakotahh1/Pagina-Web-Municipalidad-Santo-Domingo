/* Barrel export de la capa de servicios.
   Centraliza los imports para que los componentes solo necesiten, por ejemplo:
   import { loginVecino, getAnimales } from '../services'; */

export { apiRequest, ApiError, session, setUnauthorizedHandler } from './api';

export { loginVecino, loginAdmin, registerVecino, fetchProfile } from './authService';
export type { UserRole, AuthUser, LoginCredentials, RegisterData } from './authService';

export { getAnimales, getAnimalById, toCard } from './animalesService';
export type { Animal, AnimalCard } from './animalesService';

export { getReportes, crearReporte, actualizarEstadoReporte, eliminarReporte } from './reportesService';
export type { Reporte, NuevoReporte } from './reportesService';

export { getOperativos, inscribirseOperativo } from './operativosService';
export type { Operativo } from './operativosService';

export { getPublicaciones, crearPublicacion } from './foroService';
export type { Publicacion } from './foroService';

export { solicitarAdopcion } from './adopcionesService';
export type { SolicitudAdopcion } from './adopcionesService';
