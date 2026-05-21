/*servicio de animales.
  centraliza el acceso a datos de animales, adopciones y fichas clínicas.
  en la entrega parcial 2 se conectará con la API REST del backend.

  por ahora devuelve datos hardcodeados simulando llamadas asíncronas*/

export interface Animal {
  id: number;
  nombre: string;
  tipo: 'Perro' | 'Gato';
  urgente: boolean;
  detalles: string;
  etiquetas: string[];
  imagen: string;
}

export interface FichaAnimal {
  id: number;
  nombre: string;
  tipo: string;
  descripcionCorta: string;
  edad: string;
  sexo: string;
  etiquetas: string[];
  chip: string;
  imagenPrincipal: string;
  miniaturas: string[];
  infoDetallada: { clave: string; valor: string }[];
  historial: { fecha: string; evento: string }[];
  notas: string;
  inspector: string;
}

/*obtiene la lista de animales disponibles para adopción.
  en EP2: fetch GET /api/animales*/
export const getAnimales = async (): Promise<Animal[]> => {
  return [
    { id: 1, nombre: 'Camaron', tipo: 'Gato', urgente: false, detalles: 'Gato mestizo · 3 años · Macho', etiquetas: ['Vacunado', 'Castrado'], imagen: '/assets/camaron.jpg' },
    { id: 2, nombre: 'Kenai', tipo: 'Perro', urgente: false, detalles: 'Perro mestizo · 3 años · Macho', etiquetas: ['Vacunado', 'Castrado'], imagen: '/assets/kenai.jpg' },
    { id: 3, nombre: 'Leonidas', tipo: 'Perro', urgente: true, detalles: 'Perro mestizo · 3 años · Macho', etiquetas: ['Vacunado', 'Castrado'], imagen: '/assets/leonidas.jpg' },
    { id: 4, nombre: 'Yuumi', tipo: 'Gato', urgente: false, detalles: 'Gata Tuxedo · 3 Meses · Hembra', etiquetas: ['Vacunado'], imagen: '/assets/yuumi.jpg' },
    { id: 5, nombre: 'Pana Miguel', tipo: 'Gato', urgente: false, detalles: 'Gato mestizo · 3 años · Macho', etiquetas: ['Vacunado', 'Castrado'], imagen: '/assets/panamiguel.jpg' },
    { id: 6, nombre: 'Meperdonas', tipo: 'Gato', urgente: false, detalles: 'Gato mestizo · 3 años · Macho', etiquetas: ['Vacunado', 'Castrado'], imagen: '/assets/meperdonas.jpg' },
  ];
};

/*obtiene la ficha completa de un animal por su id.
  en EP2: fetch GET /api/animales/:id*/
export const getFichaAnimal = async (id: number): Promise<FichaAnimal | null> => {
  const fichas: FichaAnimal[] = [
    {
      id: 1, nombre: 'Camaron', tipo: 'Gatos', descripcionCorta: 'Gato mestizo', edad: '3 años', sexo: 'Macho',
      etiquetas: ['Vacunado', 'Castrado'], chip: 'ABCD-9999-0000-22222',
      imagenPrincipal: '/assets/camaron.jpg', miniaturas: ['/assets/gato2.jpg', '/assets/gato3.jpg'],
      infoDetallada: [
        { clave: 'Especie', valor: 'Gato' }, { clave: 'Raza', valor: 'Naranjito' },
        { clave: 'Sexo', valor: 'Macho' }, { clave: 'Edad Estimada', valor: '3 años' },
        { clave: 'Tamaño', valor: 'Mediano' }, { clave: 'Color', valor: 'Naranjo con blanco' },
        { clave: 'Zona de Rescate', valor: 'De casa' },
      ],
      historial: [
        { fecha: '15 enero 2025', evento: 'Control veterinario rutinario. Estado general bueno.' },
        { fecha: '03 noviembre 2024', evento: 'Operativo de esterilización – Sector norte. Castración exitosa.' },
      ],
      notas: 'Camaron es un gatito lindo que come mucho y no sabe cuando parar de comer.',
      inspector: 'Vicente Palma',
    },
    {
      id: 2, nombre: 'Kenai', tipo: 'Perros', descripcionCorta: 'Perro mestizo', edad: '3 años', sexo: 'Macho',
      etiquetas: ['Vacunado', 'Castrado'], chip: 'KEN-8888-1111-33333',
      imagenPrincipal: '/assets/kenai.jpg', miniaturas: ['/assets/kenai_thumb1.jpg', '/assets/kenai_thumb2.jpg'],
      infoDetallada: [
        { clave: 'Especie', valor: 'Perro' }, { clave: 'Raza', valor: 'Mestizo' },
        { clave: 'Sexo', valor: 'Macho' }, { clave: 'Edad Estimada', valor: '3 años' },
        { clave: 'Tamaño', valor: 'Grande' }, { clave: 'Color', valor: 'Blanco' },
        { clave: 'Zona de Rescate', valor: 'Sector Centro' },
      ],
      historial: [{ fecha: '10 enero 2025', evento: 'Vacunación séxtuple aplicada.' }],
      notas: 'Kenai es muy juguetón y requiere espacio para correr.',
      inspector: 'Andrea Silva',
    },
    {
      id: 3, nombre: 'Leonidas', tipo: 'Perros', descripcionCorta: 'Perro mestizo', edad: '3 años', sexo: 'Macho',
      etiquetas: ['Vacunado', 'Castrado'], chip: 'LEO-7777-2222-44444',
      imagenPrincipal: '/assets/leonidas.jpg', miniaturas: ['/assets/leonidas_thumb1.jpg', '/assets/leonidas_thumb2.jpg'],
      infoDetallada: [
        { clave: 'Especie', valor: 'Perro' }, { clave: 'Raza', valor: 'Mestizo' },
        { clave: 'Sexo', valor: 'Macho' }, { clave: 'Edad Estimada', valor: '3 años' },
        { clave: 'Tamaño', valor: 'Mediano' }, { clave: 'Color', valor: 'Negro' },
        { clave: 'Zona de Rescate', valor: 'Sector Sur' },
      ],
      historial: [{ fecha: '05 febrero 2025', evento: 'Ingreso y revisión general.' }],
      notas: 'Un perro muy leal y protector.',
      inspector: 'Carlos Pérez',
    },
  ];
  return fichas.find(f => f.id === id) || null;
};
