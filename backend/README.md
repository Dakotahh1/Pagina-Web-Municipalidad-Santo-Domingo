# Backend — Sistema de Gestión de Bienestar Animal

API REST para el Sistema de Gestión de Bienestar Animal de la Municipalidad de Santo Domingo.
Desarrollado con Node.js + Express + TypeScript.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Instalación

```bash
cd backend
npm install
cp .env.example .env
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
├── server.ts                ← punto de entrada
├── app.ts                   ← configuración Express
├── types/index.ts           ← interfaces TypeScript
├── utils/responseHelper.ts  ← helpers para respuestas JSON
├── middlewares/             ← logger y manejo de errores
├── data/mockData.ts         ← datos en memoria (EP 2.2 → BD real)
├── controllers/             ← lógica de cada endpoint
└── routes/                  ← definición de rutas REST
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
| POST   | /api/auth/login           | Inicio de sesión                    |
| POST   | /api/auth/register        | Registro de usuario                 |

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

## Próximas entregas

- EP 2.2 → migrar `data/mockData.ts` a PostgreSQL/MySQL
- EP 2.5 → implementar JWT en `authController.ts`
- EP 2.6 → hashear contraseñas con bcrypt
- EP 2.7 → documentación Postman/Insomnia y evidencia de pruebas
