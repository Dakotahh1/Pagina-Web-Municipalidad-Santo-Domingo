-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "rut" TEXT NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "comuna" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "rol_id" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mascota" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "raza" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "edad" INTEGER NOT NULL,
    "color" TEXT NOT NULL DEFAULT '',
    "vacunado" BOOLEAN NOT NULL DEFAULT false,
    "castrado" BOOLEAN NOT NULL DEFAULT false,
    "chip" TEXT,
    "descripcion" TEXT NOT NULL DEFAULT '',
    "estado_adopcion" TEXT NOT NULL DEFAULT 'Disponible',
    "imagenes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mascota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reporte" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "tipo_incidente" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "latitud" DECIMAL(65,30) NOT NULL,
    "longitud" DECIMAL(65,30) NOT NULL,
    "sector" TEXT NOT NULL,
    "urgente" BOOLEAN NOT NULL DEFAULT false,
    "estado" TEXT NOT NULL DEFAULT 'Pendiente',
    "fotos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "inspector_asignado" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operativo" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL DEFAULT '',
    "fecha_evento" TIMESTAMP(3) NOT NULL,
    "hora" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "cupos_totales" INTEGER NOT NULL,
    "cupos_disponibles" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Programado',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Operativo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InscripcionOperativo" (
    "id" SERIAL NOT NULL,
    "operativo_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "fecha_inscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InscripcionOperativo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolicitudAdopcion" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "mascota_id" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "estado_solicitud" TEXT NOT NULL DEFAULT 'Pendiente',
    "fecha_solicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolicitudAdopcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForoPublicacion" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "categoria" TEXT NOT NULL DEFAULT 'General',
    "fecha_publicacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForoPublicacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_rut_key" ON "Usuario"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "InscripcionOperativo_operativo_id_usuario_id_key" ON "InscripcionOperativo"("operativo_id", "usuario_id");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InscripcionOperativo" ADD CONSTRAINT "InscripcionOperativo_operativo_id_fkey" FOREIGN KEY ("operativo_id") REFERENCES "Operativo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InscripcionOperativo" ADD CONSTRAINT "InscripcionOperativo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudAdopcion" ADD CONSTRAINT "SolicitudAdopcion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudAdopcion" ADD CONSTRAINT "SolicitudAdopcion_mascota_id_fkey" FOREIGN KEY ("mascota_id") REFERENCES "Mascota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForoPublicacion" ADD CONSTRAINT "ForoPublicacion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
