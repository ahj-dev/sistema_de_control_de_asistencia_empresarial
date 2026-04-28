import { IsUUID, IsNotEmpty } from 'class-validator';

export class RegistrarEntradaDto {
  // El empleado indica su propio ID
  @IsUUID()
  @IsNotEmpty()
  empleadoId!: string;
}