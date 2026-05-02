// este archivo define el DTO para registrar la entrada de un empleado
// el empleado indica su propio ID para registrar su entrada
import { IsUUID, IsNotEmpty } from 'class-validator';

export class RegistrarEntradaDto {
  // El empleado indica su propio ID
  @IsUUID()
  @IsNotEmpty()
  empleadoId!: string;
}