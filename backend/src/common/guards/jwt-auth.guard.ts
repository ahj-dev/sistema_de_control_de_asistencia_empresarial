// Este guard se encarga de proteger los endpoints que requieren autenticación mediante JWT.
// Utiliza la estrategia de Passport que definimos en JwtStrategy para verificar el token y obtener el usuario.
// Además, revisa si el endpoint tiene el decorador @Public() para permitir acceso sin autenticación a ciertos endpoints.
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

// Este guard usa la JwtStrategy que creamos antes
// Cuando lo aplicas en un endpoint, Passport automáticamente:
// 1. Extrae el token del header Authorization: Bearer <token>
// 2. Lo verifica con el secreto
// 3. Llama a JwtStrategy.validate() para obtener el usuario
// 4. Si algo falla → lanza 401 Unauthorized automáticamente

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Revisa si el endpoint tiene el decorador @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),  // revisa el método del controller
      context.getClass(),    // revisa la clase del controller
    ]);

    // Si es público, deja pasar sin verificar token
    if (isPublic) {
      return true;
    }

    // Si no es público, verifica el JWT normalmente
    return super.canActivate(context);
  }
}