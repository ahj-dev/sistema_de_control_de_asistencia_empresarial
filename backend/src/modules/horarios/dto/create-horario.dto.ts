//Este dto se usa para crear un nuevo horario, por eso todos los campos son obligatorios excepto toleranciaMin que es opcional
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  MinLength,
  Min,
  Max,
  IsObject,
  Matches,
} from 'class-validator';

export class CreateHorarioDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nombre!: string;

  // Formato esperado: "08:00" — hora en string HH:mm
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'horaEntrada debe tener formato HH:mm (ej: 08:00)',
  })
  horaEntrada!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'horaSalida debe tener formato HH:mm (ej: 17:00)',
  })
  horaSalida!: string;

  // Minutos de tolerancia antes de contar tardanza
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(60)
  toleranciaMin?: number;

  // Ejemplo: { "lunes": true, "martes": true, "miercoles": true,
  //            "jueves": true, "viernes": true, "sabado": false, "domingo": false }
  @IsObject()
  @IsNotEmpty()
  diasLaborables!: {
    lunes: boolean;
    martes: boolean;
    miercoles: boolean;
    jueves: boolean;
    viernes: boolean;
    sabado: boolean;
    domingo: boolean;
  };
}