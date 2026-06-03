/* Barrel export de la capa de servicios.
   Centraliza los imports para que los componentes solo necesiten, por ejemplo:
   import { loginVecino, getAnimales } from '../services'; */

export { apiRequest, ApiError, session, setUnauthorizedHandler } from './api';

export { loginVecino, loginAdmin, registerVecino, fetchProfile } from './authService';
export type { UserRole, AuthUser, LoginCredentials, RegisterData } from './authService';

export { getAnimales, getAnimalById, toCard } from './animalesService';
export type { Animal, AnimalCard } from './animalesService';
