import { Animal, Reporte, SolicitudAdopcion, Operativo } from '../types';

/*almacén en memoria. cada array es la "tabla" de su recurso.
  en EP 2.2 esto se reemplazará por queries a PostgreSQL/MySQL*/

export const animalesDb: Animal[] = [
  {
    id: 'a-001', nombre: 'Camaron', especie: 'Gato', raza: 'Mestizo', sexo: 'Macho', edad: 3,
    color: 'Naranjo con blanco', vacunado: true, castrado: true,
    chip: 'ABCD-9999-0000-22222', estado: 'Disponible',
    notas: 'Gato muy comelón, sociable con humanos',
    imagenes: ['/assets/camaron.jpg'],
    fechaCreacion: '2026-01-15T10:00:00Z', fechaActualizacion: '2026-01-15T10:00:00Z'
  },
  {
    id: 'a-002', nombre: 'Kenai', especie: 'Perro', raza: 'Mestizo', sexo: 'Macho', edad: 3,
    color: 'Blanco', vacunado: true, castrado: true, chip: 'KEN-8888-1111-33333',
    estado: 'Disponible', notas: 'Muy juguetón, requiere espacio',
    imagenes: ['/assets/kenai.jpg'],
    fechaCreacion: '2026-01-20T09:30:00Z', fechaActualizacion: '2026-01-20T09:30:00Z'
  },
  {
    id: 'a-003', nombre: 'Leonidas', especie: 'Perro', raza: 'Mestizo', sexo: 'Macho', edad: 3,
    color: 'Negro', vacunado: true, castrado: true, chip: 'LEO-7777-2222-44444',
    estado: 'En tratamiento', notas: 'Perro leal y protector',
    imagenes: ['/assets/leonidas.jpg'],
    fechaCreacion: '2026-02-05T11:00:00Z', fechaActualizacion: '2026-02-05T11:00:00Z'
  },
];

export const reportesDb: Reporte[] = [
  {
    id: 'r-001', vecinoRut: '12.345.678-9', tipo: 'Abandono',
    descripcion: 'Camada de cachorros abandonada en la plaza',
    urgente: true, ubicacion: { lat: -33.6437, lng: -71.6311, sector: 'La Parroquia' },
    estado: 'Pendiente', fotos: [], inspectorAsignado: null,
    fechaCreacion: '2026-05-19T08:30:00Z', fechaActualizacion: '2026-05-19T08:30:00Z'
  },
  {
    id: 'r-002', vecinoRut: '15.456.789-0', tipo: 'Animal herido',
    descripcion: 'Perro lesionado al costado de la ruta',
    urgente: true, ubicacion: { lat: -33.6500, lng: -71.6400, sector: 'Sector Norte' },
    estado: 'En proceso', fotos: [], inspectorAsignado: 'V. Palma Lucero',
    fechaCreacion: '2026-05-20T14:15:00Z', fechaActualizacion: '2026-05-21T09:00:00Z'
  },
];

export const adopcionesDb: SolicitudAdopcion[] = [
  {
    id: 's-001', animalId: 'a-001', vecinoRut: '18.987.654-3',
    vecinoNombre: 'María González', vecinoTelefono: '+56 9 1234 5678',
    motivo: 'Tengo experiencia con gatos y casa amplia',
    estado: 'Pendiente',
    fechaCreacion: '2026-05-18T16:00:00Z', fechaActualizacion: '2026-05-18T16:00:00Z'
  },
];

export const operativosDb: Operativo[] = [
  {
    id: 'o-001', titulo: 'Vacunación antirrábica mayo', tipo: 'Vacunación',
    fecha: '2026-05-25', hora: '09:00', ubicacion: 'Gimnasio Municipal',
    cupos: 200, cuposDisponibles: 145,
    descripcion: 'Vacunación gratuita para perros y gatos. Llevar al animal con collar o transportadora.',
    estado: 'Programado',
    fechaCreacion: '2026-05-01T10:00:00Z', fechaActualizacion: '2026-05-15T14:00:00Z'
  },
];
