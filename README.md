# App Bienestar Animal - Municipalidad de Santo Domingo

Esta aplicación es una plataforma desarrollada para la Municipalidad de Santo Domingo que busca fomentar la tenencia responsable de mascotas, permitiendo a los usuarios reportar incidentes, gestionar adopciones y visualizar un mapa de calor comunal en tiempo real.

**Prototipo interactivo en Figma:** [Ver Mockup Web](https://www.figma.com/site/3oyQIa6mumsEFA5U5rl4V9/Mockup-WEB?node-id=0-1&p=f&t=PePYONOImoEJhd8l-0) *(acceso público)*  
**Arquitectura UX en Figma:** [Ver Diagrama Completo](https://www.figma.com/board/cgeHwEwXP67bQdPYxucQKI/Arquitectura-UX---Bienestar-Animal?node-id=0-1&p=f&t=DJdrskBNUpx3DqUi-0) *(acceso público)*

---

## Requisitos e Instalación (Solución a Conflicto de Dependencias)

> ⚠️ **NOTA CRÍTICA DE INSTALACIÓN:** Debido a que el entorno utiliza configuraciones de vanguardia basadas en **Vite 8.0**, y ciertos plugins internos de Ionic y Vitest mantienen dependencias de revisión previas, el gestor de paquetes de Node (`npm`) podría interrumpir la instalación por conflictos de pares (`ERRESOLVE`). 
>
> Para asegurar una compilación limpia y exitosa sin alterar el árbol lógico del proyecto, **es estrictamente obligatorio ejecutar la instalación utilizando la bandera de compatibilidad heredada**.



## Tecnologías Utilizadas

| Capa | Tecnología |
|------|-----------|
| Framework UI | Ionic Framework + React 18 |
| Lenguaje | TypeScript |
| Build Tool | Vite |
| Estilos | Tailwind CSS v4 |
| Enrutamiento | React Router DOM |
| Testing E2E | Cypress |

## Requisitos e Instalación

Para ejecutar este proyecto localmente, necesitas tener instalado Node.js y el CLI de Ionic.

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/Dakotahh1/Pagina-Web-Municipalidad-Santo-Domingo.git](https://github.com/Dakotahh1/Pagina-Web-Municipalidad-Santo-Domingo.git)

2. Desplazarse a la raiz del proyecto cd Pagina-Web-Municipalidad-Santo-Domingo
3. Instalar dependencia omitiendo el bloqueo de pares (Resolucion del error del entorno) : `npm install --legacy-peer-deps`
4. Levantar el servidor de desarrollo: `ionic serve`

---

## EP 1.2: Justificación del Problema y Usuario Objetivo

**Problema:** La Municipalidad de Santo Domingo carece de un sistema centralizado para gestionar incidentes de animales callejeros, dependiendo actualmente de canales informales (WhatsApp, llamadas) y registros médicos en papel. Esta fragmentación impide generar estadísticas confiables, dificulta la trazabilidad de brotes de zoonosis (ej. rabia) e imposibilita justificar administrativamente el desvío de recursos. Como señaló el Jefe de Informática municipal, la ausencia de una vía única de ingreso de datos limita la capacidad del municipio para gestionar planes de trabajo preventivos.

**Definición de Roles Estrictos**

**Rol Vecino (Ciudadano):** Ecosistema público/autenticado. Puede reportar, interactuar en foros y solicitar adopciones. No tiene acceso a datos de auditoría ni fichas clínicas ajenas.

**Rol Funcionario / Inspector (Administrador):** Acceso exclusivo al panel privado. Posee facultades para modificar estados de casos, inyectar datos de microchips y emitir multas.

---

## EP 1.1: Requerimientos del Sistema

### Roles Definidos

- **Vecino:** Ciudadano de la comuna que consume información, genera reportes y solicita adopciones.
- **Funcionario / Inspector:** Personal municipal que gestiona casos, administra fichas, registra operativos y consulta estadísticas.

### Requerimientos Funcionales

| ID | Módulo | Descripción por rol | Métrica Cuantitativa de Evaluación |
|----|--------|---------------------|------------------------------------------- |
| **RF-01** | Foro de Reportes | El Vecino puede publicar incidentes adjuntando texto, coordenadas geográficas y fotos. El Funcionario puede cambiar el estado a "Resuelto".| Tiempo de persistencia en renderizado menor a 1.5s. Admisión de strings de texto de hasta 1000 caracteres  |
| **RF-02** | Gestión de Adopciones | El Vecino visualiza animales y presiona "Solicitar". El Funcionario recibe la solicitud en una lista de espera indexada.| El sistema debe soportar un mínimo de 200 solicitudes simultáneas sin pérdida de paquetes de datos. |
| **RF-03** | Ficha Clínica Digital | El Funcionario puede crear, actualizar y archivar el historial médico de un animal (vacunas, esterilizaciones).| El formulario debe validar campos obligatorios y rechazar inputs nulos con alertas nativas en < 200ms. |
| **RF-04** | Gestión de Operativos | El Funcionario agenda operativos territoriales. El Vecino se inscribe reduciendo los cupos disponibles en tiempo real. | Decremento atómico del contador de cupos. Bloqueo automático del botón de inscripción al llegar a 0 cupos. |
| **RF-05** | Control de Microchips | El Inspector asocia un código de microchip único al RUT de un vecino mediante un formulario indexado. | Validación de expresión regular: El código de chip debe poseer exactamente 15 dígitos numéricos estándar. |
| **RF-06** | Directorio de Contactos | Ambos Roles pueden consultar teléfonos, correos y horarios de la unidad de protección animal. | Buscador reactivo indexado por caracteres que filtra los datos en pantalla en un tiempo máximo de 100ms. |
| **RF-07** | Dashboard Estadístico | El Funcionario visualiza gráficos dinámicos con los KPIs mensuales del estado de la tenencia comunal.| Precisión del 100% en el cálculo de métricas en base a las filas de la consulta relacional SQL ejecutada. |

### Requerimientos No Funcionales (Medibles)

**RNF-01 (Usabilidad / Accesibilidad):** La interfaz debe garantizar una tasa de contraste mínima de 4.5:1 para textos normales conforme a las pautas WCAG 2.1 AA, utilizando botones interactivos expansivos (mínimo 48px de área táctil) para facilitar el uso a adultos mayores en Santo Domingo.

**RNF-02 (Rendimiento en Entornos Rurales):** El tamaño de carga de la landing page principal no debe exceder los 2.5 MB. Las imágenes de incidentes deben ser comprimidas en el cliente a un máximo de 2MB antes de viajar por la red, permitiendo un funcionamiento fluido en zonas con conectividad 3G/4G inestable.

**RNF-03 (Seguridad / Control de Acceso):** Todas las solicitudes a rutas administrativas (/admin/*) deben estar validadas mediante un middleware interceptor de tokens JWT. Cualquier petición sin credenciales o con un rol no autorizado debe ser rechazada y redirigida al /login en menos de 50ms.

---

## EP 1.3: Bocetos UI/UX y Mockups

A continuación se presentan las pantallas principales diseñadas para vista Web, evidenciando el diseño diferenciado por rol y sección.

**/inicio**

<img width="677" height="570" alt="image" src="https://github.com/user-attachments/assets/111b2af0-a33f-4a7c-bfec-f33583a7b38b" />

**/panel**

<img width="672" height="566" alt="image" src="https://github.com/user-attachments/assets/12dbd0b8-a774-4013-a99b-83594e06c859" />

**/fichaanimal**

<img width="677" height="567" alt="image" src="https://github.com/user-attachments/assets/73cf8f25-e1ce-4f25-a8fb-e8c59c5f878c" />

---

## EP 1.4: Arquitectura de Navegación y UX

### Diagrama General de Arquitectura UX

<!-- INSTRUCCIÓN: subir Arquitectura_UX_-_Bienestar_Animal.png a un Issue de GitHub,
     copiar el link generado y reemplazar la línea de abajo -->
>  Ver diagrama completo en Figma: [Arquitectura UX — Bienestar Animal](https://www.figma.com/board/cgeHwEwXP67bQdPYxucQKI/Arquitectura-UX---Bienestar-Animal?node-id=0-1&p=f&t=DJdrskBNUpx3DqUi-0)

### Rutas del Sistema

| Zona | Rutas Disponibles |
|------|------------------|
| **Pública** (sin sesión) | `/login` · `/registro` |
| **Ciudadana** (Vecino autenticado) | `/app/inicio` · `/app/adopciones` · `/app/adopciones/:id` · `/app/foro` · `/app/operativos` · `/app/reportar` · `/app/mapa` |
| **Administrativa** (Funcionario) | `/admin/dashboard` · `/admin/reportes` · `/admin/fichas` · `/admin/chips` · `/admin/multas` |

### Mapa de Navegación y Jerarquía de Vistas

La vista **Inicio** funciona como concentrador principal (Nivel 1). Las vistas funcionales como Adopciones o Foro corresponden al **Nivel 2**. Las vistas de detalle como la Ficha de un animal son de **Nivel 3** y siempre exigen retorno directo a su vista padre.

```mermaid
graph LR
    PUBLIC[Sitio Público] --> HOME[Home / Dashboard]

    HOME --> MAPA[Mapa de Reportes]
    HOME --> ADOPCIONES[Adopciones]
    HOME --> OPERATIVOS[Operativos]
    HOME --> FORO[Foro Vecinal]
    HOME --> LOGIN[Inicio de Sesión]

    ADOPCIONES --> FICHA[Ficha de Animal]
    FICHA --> SOLICITAR[Solicitar Adopción]

    OPERATIVOS --> INSCRIBIRSE[Inscribirse]
    OPERATIVOS --> DETALLE[Detalle Operativo]

    FORO --> VER[Ver Publicación]
    FORO --> NUEVA[Nueva Publicación]
    FORO --> REPORTE[Reportar Abandono]

    LOGIN --> ROL{Rol de\nUsuario}

    ROL -->|Funcionario / Inspector| PANEL["Panel de Gestión"]
    ROL -->|Vecino| VISTA["Vista Ciudadana"]

    PANEL --> CHIPS[Control de Chips]
    PANEL --> MULTAS[Multas Emitidas]
    PANEL --> DASH[Dashboard KPIs]
    PANEL --> DIR[Directorio Contactos]
    PANEL --> OPS[Operativos Admin]
    PANEL --> GREP[Gestión de Reportes]
    PANEL --> FICHAS[Fichas de Animales]

    VISTA --> FORO_A[Foro Vecinal autenticado]
    VISTA --> MIS_R[Mis Reportes]
    VISTA --> MIS_A[Mis Adopciones]

    style PUBLIC fill:#f3f4f6,stroke:#9ca3af,color:#111
    style ROL fill:#f5a623,stroke:#c67c00,color:#111
    style PANEL fill:#255c99,color:#fff
    style VISTA fill:#2d6aab,color:#fff
```

### Permisos por Rol

| Acción | Público | Vecino | Funcionario | Inspector |
|--------|:-------:|:------:|:-----------:|:---------:|
| Ver adopciones | ✅ | ✅ | ✅ | ✅ |
| Ver Home / Dashboard | ✅ | ✅ | ✅ | ✅ |
| Ver mapa de reportes | ✅ | ✅ | ✅ | ✅ |
| Ver operativos | ✅ | ✅ | ✅ | ✅ |
| Leer foro | ✅ | ✅ | ✅ | ✅ |
| Solicitar adopción | ❌ | ✅ | ✅ | ✅ |
| Reportar incidente | ❌ | ✅ | ✅ | ✅ |
| Mis reportes y seguimiento | ❌ | ✅ | ✅ | ✅ |
| Publicar en foro | ❌ | ✅ | ✅ | ✅ |
| Dar animal en adopción | ❌ | ✅ | ✅ | ✅ |
| Dashboard con KPIs | ❌ | ❌ | ✅ | ✅ |
| Crear y editar fichas | ❌ | ❌ | ✅ | ✅ |
| Gestionar reportes | ❌ | ❌ | ✅ | ✅ |
| Directorio de contactos | ❌ | ❌ | ✅ | ✅ |
| Registrar operativos | ❌ | ❌ | ✅ | ✅ |
| Publicaciones oficiales | ❌ | ❌ | ✅ | ✅ |
| Fotografías y evidencia | ❌ | ❌ | ❌ | ✅ |
| Registrar chips | ❌ | ❌ | ❌ | ✅ |
| Emitir multas | ❌ | ❌ | ❌ | ✅ |
| Delegar y asignar casos | ❌ | ❌ | ❌ | ✅ |

### Flujo de Tarea Principal — Reportar un Incidente

El reporte ciudadano es el flujo más crítico del sistema. Está diseñado como un asistente paso a paso para reducir la fricción, especialmente cuando el usuario enfrenta una situación urgente.

<img width="1497" height="712" alt="image" src="https://github.com/user-attachments/assets/1afae737-1df6-4d4e-a615-978d0cbe3383" />

```mermaid
flowchart TD
    START([Usuario en Home]) --> CLICK[Clic en Reportar Incidente]
    CLICK --> SESION{¿Sesión\niniciada?}
    SESION -->|No| REDIRECT[Redirige a Inicio de Sesión]
    REDIRECT --> AUTH[Usuario se autentica]
    SESION -->|Sí| PASO1

    AUTH --> PASO1[Paso 1 — Seleccionar tipo de incidente]
    PASO1 --> PASO2[Paso 2 — Marcar ubicación en mapa]
    PASO2 --> PASO3[Paso 3 — Descripción y fotos opcionales]
    PASO3 --> URGENTE{¿Es urgente?}

    URGENTE -->|Sí| U_TAG[Marca como urgente]
    URGENTE -->|No| N_TAG[Marca como normal]
    U_TAG --> ENVIAR
    N_TAG --> ENVIAR

    ENVIAR[Enviar Reporte] --> CONFIRM([Confirmación con número de caso])
    CONFIRM --> NOTIF[Inspector recibe notificación]
    NOTIF --> EVAL[Inspector evalúa y asigna]
    EVAL --> ESTADO{¿Estado\ndel caso?}

    ESTADO -->|Resuelto| CERRADO([Caso cerrado — vecino notificado])
    ESTADO -->|Pendiente| SEGUIMIENTO([Seguimiento en Mis Reportes])

    style START fill:#2d6aab,color:#fff
    style CONFIRM fill:#16a34a,color:#fff
    style CERRADO fill:#16a34a,color:#fff
    style SEGUIMIENTO fill:#2d6aab,color:#fff
    style SESION fill:#f5a623,stroke:#c67c00,color:#111
    style URGENTE fill:#f5a623,stroke:#c67c00,color:#111
    style ESTADO fill:#f5a623,stroke:#c67c00,color:#111
    style REDIRECT fill:#b01717,color:#fff
```

### Decisiones de Diseño Justificadas

- **Navbar fija en lugar de menú hamburguesa:** El perfil de usuario incluye adultos mayores que pueden desorientarse con menús ocultos. La barra de navegación permanente con accesos directos mejora la orientación espacial.
- **Separación visual total entre zona ciudadana y panel administrativo:** Los funcionarios requieren flujos de trabajo distintos (tablas, KPIs, formularios técnicos) que no son apropiados para el vecino.
- **Diseño responsivo diferenciado:** En escritorio (Funcionario) se emplea un Sidebar para aprovechar el ancho de pantalla. En móvil (Vecino) la navegación usa Bottom Tabs para acceso con una sola mano.
- **SPA / PWA con Ionic + React:** Permite acceso instantáneo mediante códigos QR sin consumir almacenamiento en dispositivos de gama baja, cumpliendo los requisitos del entorno rural-comunal.

---

## Equipo de Desarrollo

| Nombre | Rol |
|--------|-----|
| Vicente Palma | Desarrollador Frontend, Documentación |
| Diego Alvarado | Aquitectura y Diseño UI/UX, Desarrollador Frontend |
| Ignacia Brahim | Documentación, Aquitectura y Diseño UI/UX  |

---

*Documento elaborado a partir de entrevista con el Jefe de Informática de la Municipalidad de Santo Domingo.*  
*Curso ICI4247-2 — Pontificia Universidad Católica de Valparaíso, 2026.*
