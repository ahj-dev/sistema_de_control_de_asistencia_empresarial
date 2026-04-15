// Módulo raíz de la aplicación NestJS, Registra los módulos, controladores y servicios globales
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { DepartamentosModule } from './modules/departamentos/departamentos.module';
import { EmpleadosModule } from './modules/empleados/empleados.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    PrismaModule,
    DepartamentosModule,
    EmpleadosModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // APP_GUARD aplica el guard en TODOS los endpoints
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}