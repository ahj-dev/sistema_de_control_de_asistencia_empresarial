// Este módulo se encarga de gestionar los departamentos de la empresa.
// Además, se encarga de mantener la relación entre los departamentos y los empleados que trabajan en ellos.
// El módulo incluye un controlador para manejar las solicitudes HTTP relacionadas con los departamentos, un servicio para implementar la lógica de negocio y un repositorio para interactuar con la base de datos. 
// También se exporta el repositorio para que pueda ser utilizado por otros módulos, como el módulo de empleados, que necesita acceder a la información de los departamentos para asignar empleados a ellos.
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