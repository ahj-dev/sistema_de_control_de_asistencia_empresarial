import { IsUUID, IsOptional, IsDateString } from 'class-validator';

export class FiltrarAsistenciaDto {
  @IsUUID()
  @IsOptional()
  empleadoId?: string;

  // Formato: "2026-03-25"
  @IsDateString()
  @IsOptional()
  fecha?: string;

  // Formato: "2026-03" para filtrar por mes completo
  @IsOptional()
  mes?: string;
}