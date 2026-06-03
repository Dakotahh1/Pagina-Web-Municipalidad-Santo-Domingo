/* Servicio de autenticación (EP 2.5).
   Consume los endpoints reales de autenticación del backend Express + JWT.
   Cada función devuelve el par { token, user } que la app guarda en sesión. */

import { apiRequest } from './api';

/* Roles del sistema. Coinciden con los definidos en el backend (tabla Rol). */
export type UserRole = 'vecino' | 'funcionario' | 'inspector';

/* Usuario autenticado tal como lo devuelve el backend tras login/registro. */
export interface AuthUser {
  id: number;
  nombre: string;
  correo: string;
  rol: UserRole;
}

/* Respuesta de los endpoints de autenticación: token firmado + perfil. */
interface AuthData {
  token: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  rut: string;
  correo: string;
  password: string;
  region: string;
  comuna: string;
}

/* POST /api/auth/login — inicio de sesión de vecinos. */
export const loginVecino = (credentials: LoginCredentials): Promise<AuthData> =>
  apiRequest<AuthData>('/auth/login', { method: 'POST', body: credentials });

/* POST /api/auth/admin-login — inicio de sesión de funcionarios e inspectores.
   El backend rechaza con 403 a quien tenga rol 'vecino'. */
export const loginAdmin = (credentials: LoginCredentials): Promise<AuthData> =>
  apiRequest<AuthData>('/auth/admin-login', { method: 'POST', body: credentials });

/* POST /api/auth/register — registro de un nuevo vecino. Devuelve sesión iniciada. */
export const registerVecino = (data: RegisterData): Promise<AuthData> =>
  apiRequest<AuthData>('/auth/register', { method: 'POST', body: data });

/* GET /api/auth/me — perfil del usuario dueño del token en sesión (ruta protegida). */
export const fetchProfile = (): Promise<AuthUser & { region: string; comuna: string }> =>
  apiRequest('/auth/me');
