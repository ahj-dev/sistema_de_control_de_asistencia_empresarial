import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { DepartamentosModule } from './modules/departamentos/departamentos.module';

@Module({
  imports: [
    PrismaModule,
    DepartamentosModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}