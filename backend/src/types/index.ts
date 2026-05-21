export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: { total: number; page?: number; limit?: number };
  error?: { code: string; message: string; details?: unknown };
}

export interface Animal {
  id: string;
  nombre: string;
  especie: 'Perro' | 'Gato';
  raza: string;
  sexo: 'Macho' | 'Hembra';
  edad: number;
  color: string;
  vacunado: boolean;
  castrado: boolean;
  chip: string | null;
  estado: 'Disponible' | 'Adoptado' | 'En tratamiento';
  notas: string;
  imagenes: string[];
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface Reporte {
  id: string;
  vecinoRut: string;
  tipo: 'Abandono' | 'Animal herido' | 'Mordedura' | 'Tenencia irresponsable';
  descripcion: string;
  urgente: boolean;
  ubicacion: { lat: number; lng: number; sector: string };
  estado: 'Pendiente' | 'En proceso' | 'Resuelto' | 'Cerrado';
  fotos: string[];
  inspectorAsignado: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface SolicitudAdopcion {
  id: string;
  animalId: string;
  vecinoRut: string;
  vecinoNombre: string;
  vecinoTelefono: string;
  motivo: string;
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada';
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface Operativo {
  id: string;
  titulo: string;
  tipo: 'Vacunación' | 'Esterilización' | 'Chipeo' | 'Mixto';
  fecha: string;
  hora: string;
  ubicacion: string;
  cupos: number;
  cuposDisponibles: number;
  descripcion: string;
  estado: 'Programado' | 'En curso' | 'Finalizado' | 'Cancelado';
  fechaCreacion: string;
  fechaActualizacion: string;
}
