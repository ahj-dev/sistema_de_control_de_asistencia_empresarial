import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';

// Todos los endpoints de este controller empezarán con:
// /api/v1/departamentos
@Controller('departamentos')
export class DepartamentosController {

  constructor(private readonly departamentosService: DepartamentosService) {}

  // GET /api/v1/departamentos
  @Get()
  findAll() {
    return this.departamentosService.findAll();
  }

  // GET /api/v1/departamentos/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departamentosService.findOne(id);
  }

  // POST /api/v1/departamentos
  @Post()
  create(@Body() dto: CreateDepartamentoDto) {
    return this.departamentosService.create(dto);
  }

  // PATCH /api/v1/departamentos/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDepartamentoDto) {
    return this.departamentosService.update(id, dto);
  }

  // DELETE /api/v1/departamentos/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departamentosService.remove(id);
  }
}