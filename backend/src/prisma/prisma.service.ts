// Servicio de Prisma para gestionar la conexión a la base de datos, se encarga de conectar y desconectar automáticamente al iniciar y apagar el servidor NestJS
// Esta en su propio módulo para que todos los demas puedan "inyectarlo" y usar la base de datos sin reconectarse cada vez
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // OnModuleInit: se ejecuta automáticamente cuando NestJS arranca
  async onModuleInit() {
    await this.$connect();
    console.log('Base de datos conectada');
  }

  // OnModuleDestroy: se ejecuta cuando NestJS se apaga
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Base de datos desconectada');
  }
}