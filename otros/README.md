# Carpeta `otros/` — Material complementario

Material de apoyo de las entregas, según lo solicitado en las indicaciones del proyecto.

## Contenido

| Archivo | Descripción | Entrega |
|---------|-------------|---------|
| `Bienestar-Animal.postman_collection.json` | Colección de Postman con las pruebas funcionales de la API (autenticación, seguridad por roles y animales). Importar en Postman y ejecutar con el backend en línea. | EP 2.7 |

## Enlaces a prototipos y diagramas (Figma)

- **Prototipo UI/UX (web):** https://www.figma.com/site/3oyQIa6mumsEFA5U5rl4V9/Mockup-WEB
- **Arquitectura de navegación (UX):** https://www.figma.com/board/cgeHwEwXP67bQdPYxucQKI/Arquitectura-UX---Bienestar-Animal

## Modelo relacional y arquitectura

- El **modelo relacional** está definido en código en `backend/prisma/schema.prisma`
  (fuente de verdad) y documentado con su diagrama en el `README.md` raíz (sección EP 2.1/2.2).
- La **arquitectura de navegación**, los *task flows* y la matriz de permisos por rol
  se documentan en el `README.md` raíz (sección EP 1.4).

## Cómo usar la colección de Postman

1. Levantar el backend: `cd backend && npm run dev` (http://localhost:3001).
2. En Postman: *Import* → seleccionar `Bienestar-Animal.postman_collection.json`.
3. Ejecutar primero **Autenticación → Login Funcionario**: guarda el token en la
   variable `{{token}}` de la colección.
4. Ejecutar el resto de carpetas. Las pruebas de *Pruebas de Seguridad* verifican los
   códigos 401 (sin/mal token) y 403 (rol insuficiente).
