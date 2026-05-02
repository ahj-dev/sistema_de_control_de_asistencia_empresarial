// este archivo se encarga de la interacción directa con la base de datos para el módulo de asistencia utilizando Prisma como ORM.
// Aquí se definen los métodos para crear, actualizar y consultar los registros de asistencia de los empleados.
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AsistenciaRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Buscar registro de un empleado en una fecha específica
  findByEmpleadoYFecha(empleadoId: string, fecha: Date) {
    return this.prisma.registroAsistencia.findUnique({
      where: {
        empleadoId_fecha: { empleadoId, fecha },
      },
      include: {
        empleado: {
          select: { nombres: true, apellidos: true },
        },
      },
    });
  }

  // Listar registros con filtros opcionales
  findAll(filtros: { empleadoId?: string; fecha?: Date; mesInicio?: Date; mesFin?: Date }) {
    return this.prisma.registroAsistencia.findMany({
      where: {
        ...(filtros.empleadoId && { empleadoId: filtros.empleadoId }),
        ...(filtros.fecha && { fecha: filtros.fecha }),
        ...(filtros.mesInicio && filtros.mesFin && {
          fecha: {
            gte: filtros.mesInicio,
            lte: filtros.mesFin,
          },
        }),
      },
      include: {
        empleado: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            departamento: {
              select: { nombre: true },
            },
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });
  }

  // Crear registro de entrada
  crearEntrada(data: {
    empleadoId: string;
    fecha: Date;
    horaEntrada: Date;
    minutosTarde: number;
    estado: 'PRESENTE' | 'TARDANZA';
  }) {
    return this.prisma.registroAsistencia.create({
      data: {
        empleadoId:   data.empleadoId,
        fecha:        data.fecha,
        horaEntrada:  data.horaEntrada,
        minutosTarde: data.minutosTarde,
        estado:       data.estado,
      },
      include: {
        empleado: {
          select: { nombres: true, apellidos: true },
        },
      },
    });
  }

  // Actualizar registro con la hora de salida
  registrarSalida(id: string, horaSalida: Date, horasTrabajadas: number) {
    return this.prisma.registroAsistencia.update({
      where: { id },
      data: {
        horaSalida,
        horasTrabajadas,
      },
      include: {
        empleado: {
          select: { nombres: true, apellidos: true },
        },
      },
    });
  }
}