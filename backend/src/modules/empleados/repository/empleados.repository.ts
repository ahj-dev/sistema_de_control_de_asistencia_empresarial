import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateEmpleadoDto } from '../dto/create-empleado.dto';
import { UpdateEmpleadoDto } from '../dto/update-empleado.dto';

@Injectable()
export class EmpleadosRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.empleado.findMany({
      where: { estado: 'ACTIVO' },
      orderBy: { apellidos: 'asc' },
      include: {
        departamento: {
          select: { id: true, nombre: true },
        },
      },
    });
  }

 findById(id: string) {
  return this.prisma.empleado.findUnique({
    where: { id },
    include: {
      departamento: true,
      horario: true,
    },
  });
}

  findByCedula(cedula: string) {
    return this.prisma.empleado.findUnique({
      where: { cedula },
    });
  }

  create(dto: CreateEmpleadoDto) {
    return this.prisma.empleado.create({
      data: {
        nombres:         dto.nombres,
        apellidos:       dto.apellidos,
        cedula:          dto.cedula,
        telefono:        dto.telefono,
        fechaNacimiento: dto.fechaNacimiento
          ? new Date(dto.fechaNacimiento)
          : null,
        fechaIngreso:    new Date(dto.fechaIngreso),
        departamentoId:  dto.departamentoId,
      },
      include: {
        departamento: {
          select: { id: true, nombre: true },
        },
      },
    });
  }

  update(id: string, dto: UpdateEmpleadoDto) {
    return this.prisma.empleado.update({
      where: { id },
      data: {
        ...dto,
        fechaNacimiento: dto.fechaNacimiento
          ? new Date(dto.fechaNacimiento)
          : undefined,
        fechaIngreso: dto.fechaIngreso
          ? new Date(dto.fechaIngreso)
          : undefined,
      },
      include: {
        departamento: {
          select: { id: true, nombre: true },
        },
      },
    });
  }

  softDelete(id: string) {
    return this.prisma.empleado.update({
      where: { id },
      data: { estado: 'INACTIVO' },
    });
  }
}