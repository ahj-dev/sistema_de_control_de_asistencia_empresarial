import { IsUUID, IsNotEmpty } from 'class-validator';

export class RegistrarSalidaDto {
  @IsUUID()
  @IsNotEmpty()
  empleadoId!: string;
}