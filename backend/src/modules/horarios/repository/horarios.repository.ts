//esta clase representa el repositorio de horarios, con sus métodos para interactuar con la base de datos a través de Prisma
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateHorarioDto } from '../dto/create-horario.dto';
import { UpdateHorarioDto } from '../dto/update-horario.dto';

@Injectable()
export class HorariosRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Obtiene todos los horarios activos, ordenados por nombre y con el conteo de empleados asignados a cada horario
  findAll() {
    return this.prisma.horarioLaboral.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
      include: {
        _count: {
          select: { empleados: true },
        },
      },
    });
  }

  // Obtiene un horario por su ID, incluyendo los empleados activos asignados a ese horario
  findById(id: string) {
    return this.prisma.horarioLaboral.findUnique({
      where: { id },
      include: {
        empleados: {
          where: { estado: 'ACTIVO' },
          select: {
            id: true,
            nombres: true,
            apellidos: true,
          },
        },
      },
    });
  }

    // Obtiene un horario por su nombre, para verificar duplicados al crear o actualizar un horario
  findByNombre(nombre: string) {
    return this.prisma.horarioLaboral.findUnique({
      where: { nombre },
    });
  }
// Crea un nuevo horario laboral, verificando que no exista otro con el mismo nombre y que la hora de entrada sea anterior a la hora de salida
  create(dto: CreateHorarioDto) {
    return this.prisma.horarioLaboral.create({
      data: {
        nombre:         dto.nombre,
        horaEntrada:    dto.horaEntrada,   
        horaSalida:     dto.horaSalida,     
        toleranciaMin:  dto.toleranciaMin ?? 10,
        diasLaborables: dto.diasLaborables,
      },
    });
  }

  // Actualiza un horario existente, verificando que el horario exista, que no haya otro con el mismo nombre (si se cambia el nombre) y que la hora de entrada sea anterior a la hora de salida (si se cambian las horas)
  update(id: string, dto: UpdateHorarioDto) {
    return this.prisma.horarioLaboral.update({
      where: { id },
      data: {
        nombre:         dto.nombre,
        horaEntrada:    dto.horaEntrada,
        horaSalida:     dto.horaSalida,
        toleranciaMin:  dto.toleranciaMin,
        diasLaborables: dto.diasLaborables,
        activo:         dto.activo,
      },
    });
  }

  softDelete(id: string) {
    return this.prisma.horarioLaboral.update({
      where: { id },
      data: { activo: false },
    });
  }
}