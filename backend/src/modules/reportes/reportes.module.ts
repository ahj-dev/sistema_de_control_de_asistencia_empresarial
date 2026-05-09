// Este módulo se encarga de manejar todo lo relacionado con los reportes de asistencia, como el reporte mensual por empleado.
import { Module } from '@nestjs/common';
import { ReportesController } from './controller/reportes.controller';
import { ReportesService }    from './service/reportes.service';

@Module({
  controllers: [ReportesController],
  providers:   [ReportesService],
})
export class ReportesModule {}