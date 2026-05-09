# App Bienestar Animal - Municipalidad de Santo Domingo

Esta aplicación es una plataforma desarrollada para la Municipalidad de Santo Domingo que busca fomentar la tenencia responsable de mascotas, permitiendo a los usuarios reportar incidentes, gestionar adopciones y visualizar un mapa de calor comunal en tiempo real. 

**Prototipo interactivo en Figma:** [https://www.figma.com/site/3oyQIa6mumsEFA5U5rl4V9/Mockup-WEB?node-id=0-1&p=f&t=PePYONOImoEJhd8l-0] (Nota: El enlace es de acceso público).

---

## Tecnologías Utilizadas
* **Framework Frontend:** Ionic Framework + React
* **Lenguaje:** TypeScript / CSS
* **Enrutamiento:** React Router

## Requisitos e Instalación
Para ejecutar este proyecto localmente, necesitas tener instalado Node.js y el CLI de Ionic.
1. Clonar el repositorio.
2. Abrir la terminal en la raíz del proyecto.
3. Instalar las dependencias: `npm install`
4. Levantar el servidor de desarrollo: `ionic serve`

---

## EP 1.2: Justificación del problema y Usuario Objetivo
* **Problema:** La comuna de Santo Domingo enfrenta actualmente un desafío significativo relacionado con la tenencia irresponsable de mascotas y la consecuente proliferación de animales en situación de calle. Sumado a esto, existe una grave falta de centralización de la información; los vecinos no cuentan con un canal oficial y unificado para reportar emergencias, y la municipalidad tiene dificultades para difundir sus iniciativas. Esta dispersión de datos retrasa la ayuda y disminuye el impacto de las campañas. Por lo tanto, surge la necesidad de crear una plataforma web que centralice estos procesos mediante módulos de adopciones, operativos veterinarios, foros de comunicación vecinal y reportes geolocalizados, agilizando la respuesta municipal y fomentando la participación ciudadana.
* **Usuario Objetivo:** Vecinos de la comuna de Santo Domingo (mayores de edad) interesados en el bienestar animal, agrupaciones animalistas locales que buscan visibilidad para sus rescates, y funcionarios municipales encargados de gestionar casos y operativos de salud pública.

---

## EP 1.1: Requerimientos del Sistema

### Roles Definidos
* **Usuario:** Vecino de la comuna que consume la información y genera reportes.
* **Administrador:** Funcionario municipal que gestiona los casos y aprueba adopciones.

### Requerimientos Funcionales (7 mínimos)
1. **Mapa de Calor:** Visualización de incidentes activos por geolocalización.
2. **Reporte de Incidentes:** Formulario para reportar abandonos o agresiones.
3. **Foro Vecinal:** Sección para que los usuarios de la web puedan comunicarse.
4. **Adopciones:** Sección para ver animales rescatados, revisar su ficha y solicitar adopción.
5. **Operativos:** Sección para ver operativos en curso (inscripciones) y finalizados.
6. **Panel de administrador**: Seccion para administrar la pagina, ver casos, reportes, operativos, etc.
8. **Seccion ficha animal**: Permite ver los datos de animales en adopcion y dar la opcion de solicitud de adopcion.

### Requerimientos No Funcionales
1. **Rendimiento:** El mapa de calor interactivo debe ser capaz de cargar y renderizar los puntos de incidentes geolocalizados en menos de 3 segundos bajo conexiones de red estándar (3G/4G).
2. **Seguridad:** Las credenciales y contraseñas de los usuarios en el registro deben almacenarse de forma encriptada, y el acceso a los módulos de gestión (como la aprobación de adopciones o la modificación de casos) debe estar estrictamente restringido mediante rutas protegidas exclusivas para el rol de Administrador.
3. **Usabilidad:** La plataforma web debe ser 100% responsiva, garantizando que los menús de navegación, los formularios de reporte y las tarjetas de información se adapten y funcionen correctamente tanto en resoluciones de dispositivos móviles como de escritorio.
---

## EP 1.3: Bocetos UI/UX y Mockups
A continuación se presentan ejemplos de las pantallas principales diseñadas para vista Web, evidenciando el diseño diferenciado.
**/inicio**
<img width="677" height="570" alt="image" src="https://github.com/user-attachments/assets/111b2af0-a33f-4a7c-bfec-f33583a7b38b" />

**/panel**
<img width="672" height="566" alt="image" src="https://github.com/user-attachments/assets/12dbd0b8-a774-4013-a99b-83594e06c859" />

**/fichaanimal**

<img width="677" height="567" alt="image" src="https://github.com/user-attachments/assets/73cf8f25-e1ce-4f25-a8fb-e8c59c5f878c" />

---

## EP 1.4: Arquitectura de Navegación y UX

### Mapa de Navegación y Jerarquía
La aplicación sigue una estructura jerárquica con rutas protegidas. 
* **Rutas Públicas:** `/login`, `/registro`.
* **Rutas Protegidas (Requieren autenticación):** `/inicio`, `/adopciones`, `/operativos`.

*![Mapa de Navegacion](./ruta-a-tu-imagen/mapa-navegacion.png)*

### Flujo de Tareas (Task Flow)
Flujo principal para el reporte de un incidente:
*![Diagrama DFD](./ruta-a-tu-imagen/dfd.png)*

**Justificación Técnica:** Se opto por...

---

## Equipo de Desarrollo
* **Vicente Palma** - Desarrollador Frontend
* **Diego Alvarado** - Documentación y Arquitectura
* **Ignacia Brahim** - Diseño UI/UX
