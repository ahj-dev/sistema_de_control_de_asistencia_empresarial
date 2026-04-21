-- CreateEnum
CREATE TYPE "EstadoAsistencia" AS ENUM ('PRESENTE', 'AUSENTE', 'TARDANZA', 'JUSTIFICADO', 'DIA_FESTIVO', 'FIN_DE_SEMANA');

-- CreateEnum
CREATE TYPE "TipoJustificacion" AS ENUM ('ENFERMEDAD', 'CITA_MEDICA', 'CALAMIDAD_DOMESTICA', 'PERMISO_PERSONAL', 'CAPACITACION', 'COMISION', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoAprobacion" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "TipoHoraExtra" AS ENUM ('DIURNA', 'NOCTURNA', 'DOMINICAL_DIURNA', 'DOMINICAL_NOCTURNA');

-- AlterTable
ALTER TABLE "empleados" ADD COLUMN     "horario_id" TEXT;

-- CreateTable
CREATE TABLE "horarios_laborales" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "hora_entrada" TIME NOT NULL,
    "hora_salida" TIME NOT NULL,
    "tolerancia_min" INTEGER NOT NULL DEFAULT 10,
    "dias_laborables" JSONB NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "horarios_laborales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dias_festivos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "recurrente" BOOLEAN NOT NULL DEFAULT false,
    "pais_region" TEXT NOT NULL DEFAULT 'CO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dias_festivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registros_asistencia" (
    "id" TEXT NOT NULL,
    "empleado_id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "hora_entrada" TIMESTAMP(3),
    "hora_salida" TIMESTAMP(3),
    "minutos_tarde" INTEGER NOT NULL DEFAULT 0,
    "horas_trabajadas" DECIMAL(5,2),
    "estado" "EstadoAsistencia" NOT NULL DEFAULT 'PRESENTE',
    "observacion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registros_asistencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "horarios_laborales_nombre_key" ON "horarios_laborales"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "dias_festivos_fecha_pais_region_key" ON "dias_festivos"("fecha", "pais_region");

-- CreateIndex
CREATE INDEX "registros_asistencia_fecha_idx" ON "registros_asistencia"("fecha");

-- CreateIndex
CREATE INDEX "registros_asistencia_empleado_id_fecha_idx" ON "registros_asistencia"("empleado_id", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "registros_asistencia_empleado_id_fecha_key" ON "registros_asistencia"("empleado_id", "fecha");

-- AddForeignKey
ALTER TABLE "empleados" ADD CONSTRAINT "empleados_horario_id_fkey" FOREIGN KEY ("horario_id") REFERENCES "horarios_laborales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_asistencia" ADD CONSTRAINT "registros_asistencia_empleado_id_fkey" FOREIGN KEY ("empleado_id") REFERENCES "empleados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
