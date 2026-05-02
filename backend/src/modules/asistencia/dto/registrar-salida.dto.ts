// este archivo define el DTO para registrar la salida de un empleado
// el empleado indica su propio ID para registrar su salida
import { IsUUID, IsNotEmpty } from 'class-validator';

export class RegistrarSalidaDto {
  @IsUUID()
  @IsNotEmpty()
  empleadoId!: string;
}