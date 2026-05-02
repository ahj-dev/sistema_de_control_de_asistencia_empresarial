// Este es el punto de entrada de la aplicación NestJS. Aquí se configura y arranca el servidor.
//--------------------------------------------------------------
// Importamos las dependencias necesarias para arrancar el servidor NestJS. 
// También importamos el módulo raíz de la aplicación, AppModule, que contiene toda la lógica de la aplicación.
//--------------------------------------------
//Arranca el servidor
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS — permite peticiones desde el frontend
  app.enableCors({
    origin: 'http://localhost:3000', // solo acepta peticiones de Next.js
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  //Prefijo global para todos los endpoints (http://localhost:3001/api/v1/...)
  app.setGlobalPrefix('api/v1');

  //Validacion global de DTOS — asegura que los datos entrantes sean correctos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //elimina campos no definidos en el DTO
      forbidNonWhitelisted: true, //rechaza peticiones con campos extra
      transform: true, //convierte strings a los tipos de datos definidos en el DTO
    }),
  );

   // Filter global — formato uniforme para TODOS los errores
  app.useGlobalFilters(new HttpExceptionFilter());

  // Interceptor global — formato uniforme para TODAS las respuestas exitosas
  app.useGlobalInterceptors(new TransformInterceptor());
  
//Endpoint del servidor
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Servidor corriendo en http://localhost:${port}/api/v1`);
}
bootstrap();