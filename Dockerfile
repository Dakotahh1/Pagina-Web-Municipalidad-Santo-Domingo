# ── Etapa 1: Builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias primero
COPY package*.json ./
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Compilar la aplicación Ionic/React para producción
RUN npm run build

# ── Etapa 2: Runner con Nginx ─────────────────────────────────────────────────
# Servimos los archivos estáticos con Nginx (más eficiente que node para frontend)
FROM nginx:alpine AS runner

# Copiar los archivos compilados al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración de Nginx para SPA (Single Page Application)
# Sin esto, al refrescar rutas como /adopciones da 404
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /api { \
        proxy_pass http://backend:3001; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
