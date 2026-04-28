import {
  Controller,
  Post,
  Get,
  Body,
  Query,
} from '@nestjs/common';
import { AsistenciaService } from '../service/asistencia.service';
import { RegistrarEntradaDto } from '../dto/registrar-entrada.dto';
import { RegistrarSalidaDto } from '../dto/registrar-salida.dto';
import { FiltrarAsistenciaDto } from '../dto/filtrar-asistencia.dto';

@Controller('asistencia')
export class AsistenciaController {
  constructor(private readonly asistenciaService: AsistenciaService) {}

  // POST /api/v1/asistencia/entrada
  @Post('entrada')
  registrarEntrada(@Body() dto: RegistrarEntradaDto) {
    return this.asistenciaService.registrarEntrada(dto);
  }

  // POST /api/v1/asistencia/salida
  @Post('salida')
  registrarSalida(@Body() dto: RegistrarSalidaDto) {
    return this.asistenciaService.registrarSalida(dto);
  }

  // GET /api/v1/asistencia?empleadoId=&fecha=&mes=
  @Get()
  findAll(@Query() filtros: FiltrarAsistenciaDto) {
    return this.asistenciaService.findAll(filtros);
  }
}