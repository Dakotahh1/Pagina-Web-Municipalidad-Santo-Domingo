import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // ── 1. ROLES ────────────────────────────────────────────────────────────────
  console.log('Creando roles...');
  const rolVecino = await prisma.rol.upsert({
    where: { nombre: 'vecino' },
    update: {},
    create: { nombre: 'vecino' },
  });
  const rolFuncionario = await prisma.rol.upsert({
    where: { nombre: 'funcionario' },
    update: {},
    create: { nombre: 'funcionario' },
  });
  const rolInspector = await prisma.rol.upsert({
    where: { nombre: 'inspector' },
    update: {},
    create: { nombre: 'inspector' },
  });

  // ── 2. USUARIOS ─────────────────────────────────────────────────────────────
  console.log('Creando usuarios...');
  const hashVecino      = await bcrypt.hash('vecino123', 10);
  const hashFuncionario = await bcrypt.hash('func456#', 10);
  const hashInspector   = await bcrypt.hash('insp789#', 10);

  const vecino = await prisma.usuario.upsert({
    where: { correo: 'vecino@muni.cl' },
    update: {},
    create: {
      rut: '12.345.678-9',
      nombre_completo: 'María González',
      correo: 'vecino@muni.cl',
      password_hash: hashVecino,
      region: 'Valparaíso',
      comuna: 'Santo Domingo',
      rol_id: rolVecino.id,
    },
  });

  const funcionario = await prisma.usuario.upsert({
    where: { correo: 'funcionario@muni.cl' },
    update: {},
    create: {
      rut: '15.456.789-0',
      nombre_completo: 'Carlos Muñoz',
      correo: 'funcionario@muni.cl',
      password_hash: hashFuncionario,
      region: 'Valparaíso',
      comuna: 'Santo Domingo',
      rol_id: rolFuncionario.id,
    },
  });

  const inspector = await prisma.usuario.upsert({
    where: { correo: 'inspector@muni.cl' },
    update: {},
    create: {
      rut: '9.876.543-2',
      nombre_completo: 'Inspector Rodríguez',
      correo: 'inspector@muni.cl',
      password_hash: hashInspector,
      region: 'Valparaíso',
      comuna: 'Santo Domingo',
      rol_id: rolInspector.id,
    },
  });

  // ── 3. MASCOTAS ─────────────────────────────────────────────────────────────
  console.log('Creando mascotas...');
  const camaron = await prisma.mascota.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nombre: 'Camaron',
      especie: 'Gato',
      raza: 'Mestizo',
      sexo: 'Macho',
      edad: 3,
      color: 'Naranjo con blanco',
      vacunado: true,
      castrado: true,
      chip: 'ABCD-9999-0000-22222',
      descripcion: 'Gato muy comelón, sociable con humanos',
      estado_adopcion: 'Disponible',
    },
  });

  const kenai = await prisma.mascota.upsert({
    where: { id: 2 },
    update: {},
    create: {
      nombre: 'Kenai',
      especie: 'Perro',
      raza: 'Mestizo',
      sexo: 'Macho',
      edad: 3,
      color: 'Blanco',
      vacunado: true,
      castrado: true,
      chip: 'KEN-8888-1111-33333',
      descripcion: 'Muy juguetón, requiere espacio',
      estado_adopcion: 'Disponible',
    },
  });

  await prisma.mascota.upsert({
    where: { id: 3 },
    update: {},
    create: {
      nombre: 'Leonidas',
      especie: 'Perro',
      raza: 'Mestizo',
      sexo: 'Macho',
      edad: 3,
      color: 'Negro',
      vacunado: true,
      castrado: true,
      chip: 'LEO-7777-2222-44444',
      descripcion: 'Perro leal y protector',
      estado_adopcion: 'En tratamiento',
    },
  });

  // ── 4. REPORTES ─────────────────────────────────────────────────────────────
  console.log('Creando reportes...');
  await prisma.reporte.upsert({
    where: { id: 1 },
    update: {},
    create: {
      usuario_id: vecino.id,
      tipo_incidente: 'Abandono',
      descripcion: 'Camada de cachorros abandonada en la plaza',
      latitud: -33.6437,
      longitud: -71.6311,
      sector: 'La Parroquia',
      urgente: true,
      estado: 'Pendiente',
    },
  });

  await prisma.reporte.upsert({
    where: { id: 2 },
    update: {},
    create: {
      usuario_id: vecino.id,
      tipo_incidente: 'Animal herido',
      descripcion: 'Perro lesionado al costado de la ruta',
      latitud: -33.6500,
      longitud: -71.6400,
      sector: 'Sector Norte',
      urgente: true,
      estado: 'En proceso',
      inspector_asignado: 'V. Palma Lucero',
    },
  });

  // ── 5. OPERATIVOS ───────────────────────────────────────────────────────────
  console.log('Creando operativos...');
  const operativo = await prisma.operativo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      titulo: 'Vacunación antirrábica mayo',
      tipo: 'Vacunación',
      descripcion: 'Vacunación gratuita para perros y gatos. Llevar al animal con collar o transportadora.',
      fecha_evento: new Date('2026-05-25T09:00:00Z'),
      hora: '09:00',
      ubicacion: 'Gimnasio Municipal',
      cupos_totales: 200,
      cupos_disponibles: 145,
      estado: 'Programado',
    },
  });

  // ── 6. SOLICITUD DE ADOPCIÓN ────────────────────────────────────────────────
  console.log('Creando solicitudes de adopción...');
  await prisma.solicitudAdopcion.upsert({
    where: { id: 1 },
    update: {},
    create: {
      usuario_id: vecino.id,
      mascota_id: camaron.id,
      motivo: 'Tengo experiencia con gatos y casa amplia',
      telefono: '+56 9 1234 5678',
      estado_solicitud: 'Pendiente',
    },
  });

  // ── 7. FORO ─────────────────────────────────────────────────────────────────
  console.log('Creando publicaciones del foro...');
  await prisma.foroPublicacion.upsert({
    where: { id: 1 },
    update: {},
    create: {
      usuario_id: vecino.id,
      titulo: 'Perro abandonado frente a la plaza',
      contenido: 'Vi esta mañana a un perro mediano, color café, que lleva varios días en la plaza central.',
      categoria: 'Abandono',
    },
  });

  await prisma.foroPublicacion.upsert({
    where: { id: 2 },
    update: {},
    create: {
      usuario_id: funcionario.id,
      titulo: 'Operativo de vacunación antirrábica — 25 de enero',
      contenido: 'Informamos a la comunidad que realizaremos un operativo gratuito de vacunación antirrábica.',
      categoria: 'General',
    },
  });

  console.log('✅ Seed completado exitosamente');
  console.log('');
  console.log('Usuarios de prueba:');
  console.log('  vecino@muni.cl       → vecino123');
  console.log('  funcionario@muni.cl  → func456#');
  console.log('  inspector@muni.cl    → insp789#');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
