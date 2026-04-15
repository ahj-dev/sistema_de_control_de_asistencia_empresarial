// Este decorador se utiliza para marcar ciertos endpoints como públicos, lo que significa que no requerirán autenticación para ser accedidos. 
// Esto es útil para endpoints como el de inicio de sesión o registro, que deben estar disponibles para usuarios no autenticados. 
// Al usar @Public() en un controlador o método, se establece una metadata que puede ser verificada por los guardias de autenticación 
// para permitir el acceso sin necesidad de un token JWT u otro mecanismo de autenticación.
import { SetMetadata } from '@nestjs/common';

// Esta es la "etiqueta" que marcará los endpoints públicos
export const IS_PUBLIC_KEY = 'isPublic';

// @Public() es un decorador que pega esa etiqueta en el endpoint
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);