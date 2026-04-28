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