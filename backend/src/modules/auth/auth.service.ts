import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // ── REGISTRAR USUARIO ──────────────────────────
  async register(dto: RegisterDto) {
    // Verificar que el email no existe
    const existe = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (existe) {
      throw new ConflictException(
        `Ya existe un usuario con el email ${dto.email}`
      );
    }

    // Encriptar la contraseña — NUNCA guardar texto plano
    // El número 10 es el "salt rounds" — cuántas veces se encripta
    // Más alto = más seguro pero más lento. 10 es el estándar.
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        email:        dto.email,
        passwordHash: passwordHash,
        rol:          dto.rol || 'EMPLEADO',
        empleadoId:   dto.empleadoId,
      },
    });

    // No devolver el hash de la contraseña
    const { passwordHash: _, ...resultado } = usuario;
    return resultado;
  }

  // ── LOGIN ──────────────────────────────────────
  async login(dto: LoginDto) {
    // 1. Buscar el usuario por email
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (!usuario) {
      // Mensaje genérico por seguridad — no revelar si el email existe
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Verificar la contraseña contra el hash guardado
    const passwordValido = await bcrypt.compare(
      dto.password,
      usuario.passwordHash,
    );

    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // 3. Generar el token JWT
    // El "payload" es la información que va DENTRO del token
    const payload = {
      sub:   usuario.id,    // sub = subject (identificador)
      email: usuario.email,
      rol:   usuario.rol,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      usuario: {
        id:    usuario.id,
        email: usuario.email,
        rol:   usuario.rol,
      },
    };
  }

  // ── PERFIL ─────────────────────────────────────
  async getProfile(userId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        empleado: {
          select: {
            id:        true,
            nombres:   true,
            apellidos: true,
          },
        },
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const { passwordHash: _, ...resultado } = usuario;
    return resultado;
  }
}