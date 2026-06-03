# Backend — Sistema de Gestión de Bienestar Animal

API REST para el Sistema de Gestión de Bienestar Animal de la Municipalidad de Santo Domingo.
Desarrollado con Node.js + Express + TypeScript.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior
- PostgreSQL 14 o superior en ejecución

## Instalación

```bash
cd backend
npm install
cp .env.example .env          # completa DATABASE_URL y JWT_SECRET
npx prisma migrate dev         # crea las tablas en PostgreSQL
npm run seed                   # carga roles, usuarios y datos de prueba
```

## Ejecución

Modo desarrollo (con recarga automática):
```bash
npm run dev
```

Modo producción:
```bash
npm run build
npm start
```

El servidor corre en `http://localhost:3001` por defecto.

## Estructura

```
src/
├── server.ts                ← punto de entrada (arranca el servidor)
├── app.ts                   ← configuración de Express, CORS y montaje de rutas
├── lib/prismaClient.ts      ← cliente Prisma (singleton)
├── types/                   ← interfaces TypeScript (auth, sobre de respuesta)
├── utils/                   ← helpers de respuestas JSON y utilidades JWT
├── middlewares/             ← verifyJWT, requireRole, logger y manejo de errores
├── controllers/             ← lógica de cada endpoint
└── routes/                  ← definición de rutas REST
prisma/
├── schema.prisma            ← modelo relacional (PostgreSQL)
├── migrations/              ← migraciones generadas
└── seed.ts                  ← datos de inicialización (roles, usuarios, mascotas, etc.)
```

## Endpoints

| Método | Endpoint                  | Descripción                         |
| ------ | ------------------------- | ----------------------------------- |
| GET    | /api/health               | Verificación de servicio activo     |
| GET    | /api/animales             | Lista animales (filtros opcionales) |
| GET    | /api/animales/:id         | Obtiene ficha de animal             |
| POST   | /api/animales             | Crea ficha de animal                |
| PUT    | /api/animales/:id         | Reemplazo completo del recurso      |
| PATCH  | /api/animales/:id         | Actualización parcial               |
| DELETE | /api/animales/:id         | Elimina ficha                       |
| GET    | /api/reportes             | Lista reportes ciudadanos           |
| GET    | /api/reportes/:id         | Obtiene reporte                     |
| POST   | /api/reportes             | Crea reporte (vecino)               |
| PATCH  | /api/reportes/:id         | Actualiza estado (inspector)        |
| DELETE | /api/reportes/:id         | Elimina reporte                     |
| GET    | /api/adopciones           | Lista solicitudes                   |
| GET    | /api/adopciones/:id       | Obtiene solicitud                   |
| POST   | /api/adopciones           | Vecino solicita adopción            |
| PATCH  | /api/adopciones/:id       | Aprueba/rechaza solicitud           |
| DELETE | /api/adopciones/:id       | Cancela solicitud                   |
| GET    | /api/operativos           | Lista operativos                    |
| GET    | /api/operativos/:id       | Obtiene operativo                   |
| POST   | /api/operativos           | Crea operativo                      |
| PUT    | /api/operativos/:id       | Reemplazo completo                  |
| PATCH  | /api/operativos/:id       | Actualización parcial               |
| DELETE | /api/operativos/:id       | Elimina operativo                   |
| POST   | /api/auth/login           | Inicio de sesión (vecino)           |
| POST   | /api/auth/register        | Registro de vecino                  |
| POST   | /api/auth/admin-login     | Inicio de sesión (funcionario/inspector) |
| GET    | /api/auth/me              | Perfil del token en sesión (protegido)   |
| GET    | /api/auth/admin/panel     | Panel de gestión (funcionario/inspector) |
| GET    | /api/auth/inspector/chips | Control de chips (solo inspector)        |

## Estructura de respuesta

Éxito (objeto único):
```json
{ "success": true, "data": { ... }, "message": "..." }
```

Éxito (listado):
```json
{ "success": true, "data": [...], "meta": { "total": 12 } }
```

Error:
```json
{ "success": false, "error": { "code": "NOT_FOUND", "message": "..." } }
```

## Códigos HTTP usados

- `200` OK — operación exitosa
- `201` Created — recurso creado
- `204` No Content — eliminación exitosa
- `400` Bad Request — datos inválidos
- `401` Unauthorized — credenciales inválidas
- `404` Not Found — recurso inexistente
- `409` Conflict — conflicto con estado actual del recurso
- `500` Internal Server Error — error del servidor

## Seguridad implementada (EP 2.5 y 2.6)

- **Persistencia real (EP 2.2):** PostgreSQL con Prisma ORM (`prisma/schema.prisma`).
- **Autenticación JWT (EP 2.5):** firma HS256 con expiración configurable; rutas
  protegidas mediante el middleware `verifyJWT`.
- **Diferenciación por roles (EP 2.5):** middleware `requireRole` para `vecino`,
  `funcionario` e `inspector`.
- **Contraseñas con bcrypt (EP 2.6):** hash con 10 *salt rounds*; nunca se almacenan
  ni viajan en texto plano.
- **Anti-inyección SQL (EP 2.6):** consultas parametrizadas a través de Prisma.
- **Validación de inputs (EP 2.6):** formato de RUT, correo y longitud de contraseña.
