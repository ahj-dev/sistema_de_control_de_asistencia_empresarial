import { EstadoEmpleado } from '@prisma/client';

export class Empleado {
  id!: string;
  nombres!: string;
  apellidos!: string;
  cedula!: string;
  telefono?: string;
  fechaNacimiento?: Date;
  fechaIngreso!: Date;
  estado!: EstadoEmpleado;
  departamentoId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}