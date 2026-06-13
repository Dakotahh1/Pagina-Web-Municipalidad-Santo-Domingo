# ── Etapa 1: Builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# En el contenedor la app llama a la API por la ruta relativa /api, que Nginx
# reenvía al backend (ver default.conf). Así no depende del host ni dispara CORS.
ENV VITE_API_URL=/api
RUN npm run build

# ── Etapa 2: Runner con Nginx ─────────────────────────────────────────────────
# Servimos los archivos estáticos con Nginx (más eficiente que Node para el front).
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración de Nginx:
#  - try_files: enrutado SPA (al refrescar /adopciones no da 404).
#  - location /api: reverse proxy hacia el contenedor del backend.
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    location /api {\n\
        proxy_pass http://backend:3001;\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
