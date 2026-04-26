//este modulo se encarga de gestionar todo lo relacionado con los horarios laborales. 
//incluyendo la definición de rutas, la lógica de negocio y el acceso a datos a través del repositorio.
//Proporciona una estructura organizada para manejar las operaciones CRUD sobre los horarios laborales y su integración con otros módulos del sistema,
//como el módulo de asistencia para verificar que no se desactiven horarios con empleados activos asignados.
import { Module } from '@nestjs/common';
import { HorariosController } from './controller/horarios.controller';
import { HorariosService } from './service/horarios.service';
import { HorariosRepository } from './repository/horarios.repository';

@Module({
  controllers: [HorariosController],
  providers: [HorariosService, HorariosRepository],
  exports: [HorariosRepository], // lo necesitará AsistenciaModule
})
export class HorariosModule {}