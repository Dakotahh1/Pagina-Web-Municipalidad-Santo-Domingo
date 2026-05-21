/*barrel export de todos los servicios.
  centraliza los imports para que los componentes solo necesiten:
  import { loginUser, getAnimales } from '../services';*/

export { loginUser, registerUser } from './authService';
export type { LoginCredentials, RegisterData, AuthResponse } from './authService';

export { getAnimales, getFichaAnimal } from './animalesService';
export type { Animal, FichaAnimal } from './animalesService';

export { apiRequest, authService, reportesService, adopcionesService, operativosService, fichasService } from './api';
