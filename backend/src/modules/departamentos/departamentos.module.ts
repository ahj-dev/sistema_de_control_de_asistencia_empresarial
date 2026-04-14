import { Module } from '@nestjs/common';
import { DepartamentosController } from './controller/departamentos.controller';
import { DepartamentosService } from './service/departamentos.service';
import { DepartamentosRepository } from './repository/departamentos.repository';

@Module({
  controllers: [DepartamentosController],
  providers: [DepartamentosService, DepartamentosRepository],
  exports: [DepartamentosRepository], // lo exportamos para EmpleadosModule
})
export class DepartamentosModule {}