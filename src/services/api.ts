/* Cliente HTTP central para consumir la API REST del backend (EP 2.4).
   Construido sobre `fetch`, implementa el patrón de interceptores de Axios:

   - Interceptor de PETICIÓN: inyecta automáticamente el token JWT en la cabecera
     `Authorization: Bearer <token>` de cada llamada, leyéndolo de localStorage.
   - Interceptor de RESPUESTA: si el backend responde 401 (token ausente, expirado o
     inválido), limpia la sesión y notifica a la aplicación para redirigir al login.
   - Manejo de errores tipado: traduce el sobre JSON del backend
     ({ success, data, error }) a una excepción `ApiError` con código y estado HTTP. */

// URL base del backend. Configurable por entorno (.env → VITE_API_URL).
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Claves de persistencia de la sesión en el navegador.
const TOKEN_KEY = 'bienestar.token';
const USER_KEY = 'bienestar.user';

/* Sobre de respuesta uniforme que devuelve el backend en todos los endpoints. */
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: { total: number; page?: number; limit?: number };
  error?: { code: string; message: string; details?: unknown };
}

/* Persistencia de la sesión (token JWT + datos del usuario) en localStorage,
   para que la sesión sobreviva a recargas de página. */
export const session = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  getUser: <T>(): T | null => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  },
  save: (token: string, user: unknown): void => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

/* Callback que AuthContext registra para cerrar la sesión de React cuando el
   interceptor detecta un 401. Evita un acoplamiento circular entre capas. */
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: () => void): void => {
  onUnauthorized = fn;
};

/* Error tipado que propaga el código y el estado HTTP del backend hacia la UI. */
export class ApiError extends Error {
  code: string;
  status: number;
  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
}

/* Petición genérica a la API. Devuelve directamente el `data` del sobre del
   backend, o lanza `ApiError` ante cualquier fallo (red, validación, sesión). */
export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body } = options;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  // ── Interceptor de petición: adjunta el JWT si hay sesión activa ──
  const token = session.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch solo lanza ante fallos de red (servidor caído, CORS, sin conexión).
    throw new ApiError(
      'No se pudo conectar con el servidor. Verifica que el backend esté en línea.',
      'NETWORK_ERROR',
      0,
    );
  }

  // 204 No Content (p. ej. DELETE exitoso) no trae cuerpo.
  if (response.status === 204) return undefined as T;

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  // ── Interceptor de respuesta: sesión inválida → limpiar y avisar a la app ──
  if (response.status === 401) {
    session.clear();
    onUnauthorized?.();
  }

  if (!response.ok || !payload?.success) {
    const code = payload?.error?.code ?? 'UNKNOWN_ERROR';
    const message = payload?.error?.message ?? payload?.message ?? `Error ${response.status}`;
    throw new ApiError(message, code, response.status);
  }

  return payload.data as T;
}
