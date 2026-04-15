//Se asegura de que el cuerpo JSON traiga el nombre del departamento, y que sea un string no vacío de al menos 2 caracteres. 
// La descripción es opcional, pero si se incluye, también debe ser un string.
import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateDepartamentoDto {
  @IsString()          // debe ser textoS
  @IsNotEmpty()        // no puede estar vacío
  @MinLength(2)        // mínimo 2 caracteres
  nombre!: string;

  @IsString()
  @IsOptional()        // este campo es opcional
  descripcion?: string;
}