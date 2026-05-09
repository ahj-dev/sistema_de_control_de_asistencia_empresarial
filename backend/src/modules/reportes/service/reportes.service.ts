// Este servicio se encarga de generar reportes de asistencia, como el reporte mensual por empleado.
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ReporteMensualDto } from '../dto/reporte-mensual.dto';

@Injectable()
export class ReportesService {
  constructor(private readonly prisma: PrismaService) {}

  async reporteMensualEmpleado(dto: ReporteMensualDto) {
    // 1. Parsear el mes → "2026-04" → inicio y fin del mes
    const [anio, mes] = dto.mes.split('-').map(Number);
    const inicio = new Date(anio, mes - 1, 1);  // 1 de abril
    const fin    = new Date(anio, mes, 0);       // 30 de abril

    // 2. Obtener el empleado con sus relaciones
    const empleado = await this.prisma.empleado.findUnique({
      where: { id: dto.empleadoId },
      include: {
        departamento: { select: { nombre: true } },
        horario:      true,
      },
    });

    if (!empleado) {
      throw new NotFoundException(
        `Empleado con id ${dto.empleadoId} no encontrado`
      );
    }

    // 3. Obtener todos los registros de asistencia del mes
    const registros = await this.prisma.registroAsistencia.findMany({
      where: {
        empleadoId: dto.empleadoId,
        fecha: { gte: inicio, lte: fin },
      },
      orderBy: { fecha: 'asc' },
    });

    // 4. Calcular métricas agregadas
    const diasPresente  = registros.filter(r => r.estado === 'PRESENTE').length;
    const diasTardanza  = registros.filter(r => r.estado === 'TARDANZA').length;
    const diasAusente   = registros.filter(r => r.estado === 'AUSENTE').length;
    const diasJustificado = registros.filter(r => r.estado === 'JUSTIFICADO').length;

    // Total de horas trabajadas — sumamos todos los registros
    const totalHorasTrabajadas = registros.reduce(
      (acc, r) => acc + (Number(r.horasTrabajadas) || 0),
      0,
    );

    // Total de minutos de tardanza
    const totalMinutosTarde = registros.reduce(
      (acc, r) => acc + (r.minutosTarde || 0),
      0,
    );

    // Promedio de horas por día trabajado
    const diasConHoras = registros.filter(r => r.horasTrabajadas).length;
    const promedioHoras = diasConHoras > 0
      ? Math.round((totalHorasTrabajadas / diasConHoras) * 100) / 100
      : 0;

    // 5. Armar la respuesta
    return {
      // Info del empleado
      empleado: {
        id:            empleado.id,
        nombreCompleto: `${empleado.nombres} ${empleado.apellidos}`,
        cedula:        empleado.cedula,
        departamento:  empleado.departamento?.nombre || '—',
        horario:       empleado.horario?.nombre || 'Sin horario',
        horaEntrada:   empleado.horario?.horaEntrada || '—',
        horaSalida:    empleado.horario?.horaSalida || '—',
      },

      // Período consultado
      periodo: {
        mes:    dto.mes,
        inicio: inicio.toISOString().split('T')[0],
        fin:    fin.toISOString().split('T')[0],
        totalRegistros: registros.length,
      },

      // Resumen de métricas
      resumen: {
        diasPresente,
        diasTardanza,
        diasAusente,
        diasJustificado,
        totalHorasTrabajadas: Math.round(totalHorasTrabajadas * 100) / 100,
        totalMinutosTarde,
        promedioHorasPorDia: promedioHoras,
      },

      // Detalle día a día
      detalle: registros.map(r => ({
        fecha:          r.fecha,
        horaEntrada:    r.horaEntrada,
        horaSalida:     r.horaSalida,
        horasTrabajadas: r.horasTrabajadas,
        minutosTarde:   r.minutosTarde,
        estado:         r.estado,
      })),
    };
  }
}