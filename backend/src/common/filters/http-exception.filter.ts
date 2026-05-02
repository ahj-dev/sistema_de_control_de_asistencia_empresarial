//Un Filter intercepta los errores antes de que lleguen al cliente y les da formato uniforme. (ESTE LE DA FORMATOA TODOS LOS ERRORES, NO SOLO LOS HTTP)
//Sin esto, cada error tiene su propio formato dependiendo de dónde ocurra.
//Este filtro atrapa cualquier error, ya sea un HttpException (como 404 o 400) o un error inesperado (500).
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

// @Catch() sin argumentos atrapa CUALQUIER excepción
// @Catch(HttpException) solo atraparía las HTTP
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Determinar el código de estado
        // Si es una HttpException (404, 409, 400...) usamos su código
        // Si es otro error inesperado, usamos 500
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // Obtener el mensaje de error
        let message = 'Error interno del servidor';

        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();

            // class-validator devuelve un array de mensajes
            // los unimos en un solo string legible
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const res = exceptionResponse as any;
                message = Array.isArray(res.message)
                    ? res.message.join(', ')
                    : res.message || exception.message;
            } else {
                message = String(exceptionResponse);
            }
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        // Respuesta uniforme para TODOS los errores
        response.status(status).json({
            success: false,
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}