// Módulo de Prisma para gestionar la conexión a la base de datos, se encarga de proporcionar el servicio de Prisma a toda la aplicación NestJS
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global() hace que este módulo esté disponible
// en TODA la aplicación sin necesidad de importarlo
// en cada módulo que lo necesite
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}