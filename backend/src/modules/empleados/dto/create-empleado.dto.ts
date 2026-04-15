import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateEmpleadoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  nombres!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  apellidos!: string;

  // Matches valida que sea solo números con regex
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{6,12}$/, {
    message: 'La cédula debe tener entre 6 y 12 dígitos numéricos',
  })
  cedula!: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  // Formato esperado: "1990-05-15"
  @IsDateString()
  @IsOptional()
  fechaNacimiento?: string;

  // Formato esperado: "2024-01-10"
  @IsDateString()
  @IsNotEmpty()
  fechaIngreso!: string;

  // UUID del departamento al que pertenece
  @IsUUID()
  @IsNotEmpty()
  departamentoId!: string;
}