/*servicio base para las llamadas a la API REST del backend.
  centraliza la configuración de fetch, headers y manejo de errores.
  cuando se implemente el backend en la entrega parcial 2, solo hay que
  cambiar API_BASE_URL y agregar los endpoints reales.*/

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string;
}

/*función genérica para hacer peticiones HTTP al backend.
  agrega automáticamente los headers de contenido y autorización JWT*/
export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/*servicios específicos para cada módulo de la aplicación.
  por ahora retornan datos mock; se conectarán al backend en EP2*/

export const authService = {
  login: (credentials: { email: string; password: string; role: string }) =>
    apiRequest('/auth/login', { method: 'POST', body: credentials }),

  register: (data: Record<string, unknown>) =>
    apiRequest('/auth/register', { method: 'POST', body: data }),
};

export const reportesService = {
  getAll: (token: string) =>
    apiRequest('/reportes', { token }),

  create: (data: Record<string, unknown>, token: string) =>
    apiRequest('/reportes', { method: 'POST', body: data, token }),
};

export const adopcionesService = {
  getAll: () =>
    apiRequest('/adopciones'),

  getById: (id: string) =>
    apiRequest(`/adopciones/${id}`),

  solicitarAdopcion: (animalId: string, token: string) =>
    apiRequest(`/adopciones/${animalId}/solicitar`, { method: 'POST', token }),
};

export const operativosService = {
  getAll: () =>
    apiRequest('/operativos'),

  inscribirse: (operativoId: string, token: string) =>
    apiRequest(`/operativos/${operativoId}/inscribir`, { method: 'POST', token }),
};

export const fichasService = {
  getAll: (token: string) =>
    apiRequest('/fichas', { token }),

  getById: (id: string, token: string) =>
    apiRequest(`/fichas/${id}`, { token }),

  create: (data: Record<string, unknown>, token: string) =>
    apiRequest('/fichas', { method: 'POST', body: data, token }),

  update: (id: string, data: Record<string, unknown>, token: string) =>
    apiRequest(`/fichas/${id}`, { method: 'PUT', body: data, token }),
};
