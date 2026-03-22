import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class UpdateDepartamentoDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}