// EmpleadosModule es el módulo principal para la gestión de empleados. 
// Define el controlador, servicio y repositorio relacionados con empleados
//  y también importa el módulo de departamentos para acceder a la información de los departamentos asociados a los empleados.
import { Module } from '@nestjs/common';
import { EmpleadosController } from './controller/empleados.controller';
import { EmpleadosService } from './service/empleados.service';
import { EmpleadosRepository } from './repository/empleados.repository';
import { DepartamentosModule } from '../departamentos/departamentos.module';

@Module({
  imports: [DepartamentosModule], // para usar DepartamentosRepository
  controllers: [EmpleadosController],
  providers: [EmpleadosService, EmpleadosRepository],
  exports: [EmpleadosRepository],
})
export class EmpleadosModule {}