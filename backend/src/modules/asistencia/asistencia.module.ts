import { Module } from '@nestjs/common';
import { AsistenciaController } from './controller/asistencia.controller';
import { AsistenciaService } from './service/asistencia.service';
import { AsistenciaRepository } from './repository/asistencia.repository';
import { EmpleadosModule } from '../empleados/empleados.module';

@Module({
  imports: [EmpleadosModule], // necesitamos EmpleadosRepository
  controllers: [AsistenciaController],
  providers: [AsistenciaService, AsistenciaRepository],
  exports: [AsistenciaRepository], // lo usará ReportesModule
})
export class AsistenciaModule {}