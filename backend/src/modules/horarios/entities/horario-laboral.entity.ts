// esta clase representa la entidad de horario laboral, con sus propiedades y tipos de datos
export class HorarioLaboral {
  id!: string;
  nombre!: string;
  horaEntrada!: Date;
  horaSalida!: Date;
  toleranciaMin!: number;
  diasLaborables!: object;
  activo!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}