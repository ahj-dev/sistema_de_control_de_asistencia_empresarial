// Proporciona métodos para interactuar con la base de datos a través de Prisma,
// encapsulando las operaciones CRUD para el modelo Departamento. Es el unico que toca la base de datos usando el PrismaService
//  el servicio no debe tocar la base de datos directamente.
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateDepartamentoDto } from '../dto/create-departamento.dto';
import { UpdateDepartamentoDto } from '../dto/update-departamento.dto';

@Injectable()
export class DepartamentosRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.departamento.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
      include: {
        _count: {
          select: { empleados: true },
        },
      },
    });
  }
  
  findById(id: string) {
    return this.prisma.departamento.findUnique({
      where: { id },
      include: {
        empleados: {
          where: { estado: 'ACTIVO' },
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            cedula: true,
          },
        },
      },
    });
  }

  findByNombre(nombre: string) {
    return this.prisma.departamento.findUnique({
      where: { nombre },
    });
  }

  create(dto: CreateDepartamentoDto) {
    return this.prisma.departamento.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
      },
    });
  }

  update(id: string, dto: UpdateDepartamentoDto) {
    return this.prisma.departamento.update({
      where: { id },
      data: dto,
    });
  }

  softDelete(id: string) {
    return this.prisma.departamento.update({
      where: { id },
      data: { activo: false },
    });
  }
}