// este archivo define la entidad de registro de asistencia
// representa un registro de asistencia para un empleado en una fecha específica
// incluye la hora de entrada, hora de salida, minutos tarde, horas trabajadas, estado y observación
import { EstadoAsistencia } from '@prisma/client';

export class RegistroAsistencia {
  id!: string;
  empleadoId!: string;
  fecha!: Date;
  horaEntrada?: Date;
  horaSalida?: Date;
  minutosTarde!: number;
  horasTrabajadas?: number;
  estado!: EstadoAsistencia;
  observacion?: string;
  createdAt!: Date;
  updatedAt!: Date;
}