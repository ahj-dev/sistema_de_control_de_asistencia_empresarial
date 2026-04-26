// Este dto se usa para actualizar un horario, por eso todos los campos son opcionales
import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  MinLength,
  Min,
  Max,
  IsObject,
  Matches,
} from 'class-validator';

export class UpdateHorarioDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  nombre?: string;

  // Formato esperado: "08:00" — hora en string HH:mm
  @IsString()
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'horaEntrada debe tener formato HH:mm',
  })
  horaEntrada?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'horaSalida debe tener formato HH:mm',
  })
  horaSalida?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(60)
  toleranciaMin?: number;

  @IsObject()
  @IsOptional()
  diasLaborables?: object;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}