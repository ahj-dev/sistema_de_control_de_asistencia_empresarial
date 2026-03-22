import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { Rol } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(Rol)
  @IsOptional()
  rol?: Rol;

  @IsUUID()
  @IsOptional()
  empleadoId?: string;
}