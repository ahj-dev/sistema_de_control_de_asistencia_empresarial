//este controlador es el encargado de manejar las rutas relacionadas con los horarios laborales.
//delegando la lógica de negocio al servicio correspondiente y asegurando que las solicitudes HTTP sean procesadas correctamente.
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { HorariosService } from '../service/horarios.service';
import { CreateHorarioDto } from '../dto/create-horario.dto';
import { UpdateHorarioDto } from '../dto/update-horario.dto';

@Controller('horarios')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  // GET /api/v1/horarios
  @Get()
  findAll() {
    return this.horariosService.findAll();
  }

  // GET /api/v1/horarios/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.horariosService.findOne(id);
  }

  // POST /api/v1/horarios
  @Post()
  create(@Body() dto: CreateHorarioDto) {
    return this.horariosService.create(dto);
  }

  // PATCH /api/v1/horarios/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHorarioDto) {
    return this.horariosService.update(id, dto);
  }

  // DELETE /api/v1/horarios/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.horariosService.remove(id);
  }
}