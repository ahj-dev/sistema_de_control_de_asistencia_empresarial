import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      // Extrae el token del header: Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Si el token expiró, rechaza la petición
      ignoreExpiration: false,
      // El mismo secreto que se usó para firmar el token
      secretOrKey: process.env.JWT_SECRET || 'secreto-temporal',
    });
  }

  // Este método se llama automáticamente cuando el token es válido
  // Lo que retornes aquí queda disponible como req.user en los controllers
  async validate(payload: { sub: string; email: string; rol: string }) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
    });

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }

    return {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };
  }
}