// EmpleadosController es el controlador que se encarga de gestionar las rutas relacionadas con los empleados.
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { EmpleadosService } from '../service/empleados.service';
import { CreateEmpleadoDto } from '../dto/create-empleado.dto';
import { UpdateEmpleadoDto } from '../dto/update-empleado.dto';

@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  // GET /api/v1/empleados
  @Get()
  findAll() {
    return this.empleadosService.findAll();
  }

  // GET /api/v1/empleados/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empleadosService.findOne(id);
  }

  // POST /api/v1/empleados
  @Post()
  create(@Body() dto: CreateEmpleadoDto) {
    return this.empleadosService.create(dto);
  }

  // PATCH /api/v1/empleados/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmpleadoDto) {
    return this.empleadosService.update(id, dto);
  }

  // DELETE /api/v1/empleados/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.empleadosService.remove(id);
  }
}