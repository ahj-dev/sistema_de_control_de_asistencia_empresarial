import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  // Activa la validación automática en TODOS los endpoints
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina campos que no están en el DTO
      forbidNonWhitelisted: true, // rechaza peticiones con campos extra
      transform: true, // convierte los datos al tipo correcto
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Servidor corriendo en http://localhost:${port}/api/v1`);
}
bootstrap();