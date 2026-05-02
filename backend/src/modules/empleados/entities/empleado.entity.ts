// este archivo define la entidad Empleado, que representa a un empleado en el sistema.
//  Contiene las propiedades y tipos de datos correspondientes a cada campo de la tabla de empleados en la base de datos.
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