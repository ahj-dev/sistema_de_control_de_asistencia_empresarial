import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateDepartamentoDto {
  @IsString()          // debe ser texto
  @IsNotEmpty()        // no puede estar vacío
  @MinLength(2)        // mínimo 2 caracteres
  nombre: string;

  @IsString()
  @IsOptional()        // este campo es opcional
  descripcion?: string;
}