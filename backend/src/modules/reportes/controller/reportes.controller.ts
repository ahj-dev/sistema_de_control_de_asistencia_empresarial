// Este controlador maneja las rutas relacionadas con los reportes, como el reporte mensual por empleado.
import { Controller, Get, Query } from '@nestjs/common';
import { ReportesService }        from '../service/reportes.service';
import { ReporteMensualDto }      from '../dto/reporte-mensual.dto';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  // GET /api/v1/reportes/mensual?empleadoId=xxx&mes=2026-04
  @Get('mensual')
  reporteMensual(@Query() dto: ReporteMensualDto) {
    return this.reportesService.reporteMensualEmpleado(dto);
  }
}