//Un Interceptor envuelve la respuesta exitosa antes de que salga al cliente. (ESTE LE DA FORMATO A TODAS LAS RESPUESTAS EXITOSAS, NO SOLO A LAS HTTP)
//Así todas las respuestas 200/201 tienen el mismo formato.
//Sin este interceptor, cada endpoint podría devolver un formato diferente, lo que dificulta el manejo de respuestas en el frontend.
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interfaz que define la forma de TODA respuesta exitosa
export interface ApiResponse<T> {
  success:   boolean;
  data:      T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      // map transforma lo que devuelve cada endpoint
      map((data) => ({
        success:   true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}