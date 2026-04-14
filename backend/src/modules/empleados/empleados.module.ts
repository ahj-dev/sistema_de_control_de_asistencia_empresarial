import { Module } from '@nestjs/common';
import { EmpleadosController } from './controller/empleados.controller';
import { EmpleadosService } from './service/empleados.service';
import { EmpleadosRepository } from './repository/empleados.repository';
import { DepartamentosModule } from '../departamentos/departamentos.module';

@Module({
  imports: [DepartamentosModule], // para usar DepartamentosRepository
  controllers: [EmpleadosController],
  providers: [EmpleadosService, EmpleadosRepository],
})
export class EmpleadosModule {}