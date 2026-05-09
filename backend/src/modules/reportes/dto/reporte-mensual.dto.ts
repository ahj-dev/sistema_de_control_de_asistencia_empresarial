// este DTO se utiliza para validar los datos de entrada al generar un reporte mensual
import { IsUUID, IsNotEmpty, IsString, Matches } from 'class-validator';

export class ReporteMensualDto {
  @IsUUID()
  @IsNotEmpty()
  empleadoId!: string;

  // Formato esperado: "2026-04"
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'El mes debe tener formato YYYY-MM. Ejemplo: 2026-04',
  })
  mes!: string;
}