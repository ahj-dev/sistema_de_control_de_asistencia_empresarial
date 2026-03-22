import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';

@Injectable()
export class DepartamentosService {

  // NestJS inyecta PrismaService automáticamente
  // gracias al @Injectable() y al PrismaModule @Global()
  constructor(private readonly prisma: PrismaService) {}

  // ── OBTENER TODOS ──────────────────────────────
  async findAll() {
    return this.prisma.departamento.findMany({
      where: { activo: true },   // solo los activos
      orderBy: { nombre: 'asc' }, // ordenados por nombre
      include: {
        _count: {
          select: { empleados: true }, // cuenta cuántos empleados tiene
        },
      },
    });
  }

  // ── OBTENER UNO POR ID ─────────────────────────
  async findOne(id: string) {
    const departamento = await this.prisma.departamento.findUnique({
      where: { id },
      include: {
        empleados: {
          where: { estado: 'ACTIVO' }, // solo empleados activos
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            cedula: true,
          },
        },
      },
    });

    // Si no existe, lanzamos un error 404 automáticamente
    if (!departamento) {
      throw new NotFoundException(
        `Departamento con id ${id} no encontrado`
      );
    }

    return departamento;
  }

  // ── CREAR ──────────────────────────────────────
  async create(dto: CreateDepartamentoDto) {
    // Verificar si ya existe un departamento con ese nombre
    const existe = await this.prisma.departamento.findUnique({
      where: { nombre: dto.nombre },
    });

    if (existe) {
      throw new ConflictException(
        `Ya existe un departamento llamado "${dto.nombre}"`
      );
    }

    return this.prisma.departamento.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
      },
    });
  }

  // ── ACTUALIZAR ─────────────────────────────────
  async update(id: string, dto: UpdateDepartamentoDto) {
    // Primero verificamos que existe
    await this.findOne(id);

    return this.prisma.departamento.update({
      where: { id },
      data: dto,
    });
  }

  // ── ELIMINAR (soft delete) ─────────────────────
  async remove(id: string) {
    // Primero verificamos que existe
    await this.findOne(id);

    // No borramos el registro — solo lo marcamos como inactivo
    return this.prisma.departamento.update({
      where: { id },
      data: { activo: false },
    });
  }
}