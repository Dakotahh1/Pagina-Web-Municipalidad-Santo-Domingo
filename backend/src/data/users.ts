import bcrypt from 'bcryptjs';
import { User } from '../types/auth.types';

//─────────────────────────────────────────────────────────────────────────────
//USUARIOS EN MEMORIA. HAY QUE REEMPLAZARpor queries parametrizadas cuando haya BD (DIEGO)
//db.query('SELECT * FROM usuarios WHERE correo = $1', [correo])

//Contraseñas en texto plano (SOLO para desarrollo, nunca en producción):
//   vecino@muni.cl        → vecino123
//   funcionario@muni.cl   → func456#
//   inspector@muni.cl     → insp789#
//─────────────────────────────────────────────────────────────────────────────

const crearUsuarios = async (): Promise<User[]> => [
  {
    id: 'u-001',
    nombre: 'María González',
    rut: '12.345.678-9',
    correo: 'vecino@muni.cl',
    passwordHash: await bcrypt.hash('vecino123', 10),
    rol: 'vecino',
    region: 'Valparaíso',
    comuna: 'Santo Domingo',
    activo: true,
  },
  {
    id: 'u-002',
    nombre: 'Carlos Muñoz',
    rut: '15.456.789-0',
    correo: 'funcionario@muni.cl',
    passwordHash: await bcrypt.hash('func456#', 10),
    rol: 'funcionario',
    region: 'Valparaíso',
    comuna: 'Santo Domingo',
    activo: true,
  },
  {
    id: 'u-003',
    nombre: 'Inspector Rodríguez',
    rut: '9.876.543-2',
    correo: 'inspector@muni.cl',
    passwordHash: await bcrypt.hash('insp789#', 10),
    rol: 'inspector',
    region: 'Valparaíso',
    comuna: 'Santo Domingo',
    activo: true,
  },
];

//Singleton: se genera una vez al iniciar y se reutiliza
let _usuarios: User[] | null = null;

export const getUsuarios = async (): Promise<User[]> => {
  if (!_usuarios) _usuarios = await crearUsuarios();
  return _usuarios;
};

export const findUserByCorreo = async (correo: string): Promise<User | undefined> => {
  const usuarios = await getUsuarios();
  return usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase());
};

export const findUserById = async (id: string): Promise<User | undefined> => {
  const usuarios = await getUsuarios();
  return usuarios.find(u => u.id === id);
};

//Para el register: agrega un usuario nuevo al array en memoria
export const addUser = async (user: User): Promise<void> => {
  const usuarios = await getUsuarios();
  usuarios.push(user);
};

export const existeCorreo = async (correo: string): Promise<boolean> => {
  const usuario = await findUserByCorreo(correo);
  return !!usuario;
};