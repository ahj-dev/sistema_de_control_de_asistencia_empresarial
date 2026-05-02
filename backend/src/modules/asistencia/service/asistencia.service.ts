// este servicio se encarga de la lógica de negocio relacionada con la asistencia
// registra entradas y salidas, calcula tardanzas y horas trabajadas, y lista registros
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { AsistenciaRepository } from '../repository/asistencia.repository';
import { EmpleadosRepository } from '../../empleados/repository/empleados.repository';
import { RegistrarEntradaDto } from '../dto/registrar-entrada.dto';
import { RegistrarSalidaDto } from '../dto/registrar-salida.dto';
import { FiltrarAsistenciaDto } from '../dto/filtrar-asistencia.dto';

@Injectable()
export class AsistenciaService {
  constructor(
    private readonly asistenciaRepository: AsistenciaRepository,
    private readonly empleadosRepository: EmpleadosRepository,
  ) {}

  // ── REGISTRAR ENTRADA ──────────────────────────────
  async registrarEntrada(dto: RegistrarEntradaDto) {
    const ahora = new Date();

    // 1. Obtener el empleado con su horario
    const empleado = await this.empleadosRepository.findById(dto.empleadoId);

    if (!empleado) {
      throw new NotFoundException(
        `Empleado con id ${dto.empleadoId} no encontrado`
      );
    }

    if (!empleado.horario) {
      throw new BadRequestException(
        'El empleado no tiene un horario asignado. Asigna un horario primero.'
      );
    }

    // 2. Obtener la fecha de HOY sin la hora (solo YYYY-MM-DD)
    const hoy = this.obtenerFechaSinHora(ahora);

    // 3. Verificar que no haya ya un registro de entrada hoy
    const registroExistente = await this.asistenciaRepository
      .findByEmpleadoYFecha(dto.empleadoId, hoy);

    if (registroExistente?.horaEntrada) {
      throw new ConflictException(
        'Ya existe un registro de entrada para hoy. No puedes fichar dos veces.'
      );
    }

    // 4. ── CALCULAR TARDANZA ──────────────────────────
    // El horario guarda la hora como string "08:00"
    // Construimos la hora esperada para HOY
    const horaEntradaEsperada = this.construirFechaConHora(
      hoy,
      empleado.horario.horaEntrada, // "08:00"
    );

    // Agregar los minutos de tolerancia
    const toleranciaMs = empleado.horario.toleranciaMin * 60 * 1000;
    const limiteEntrada = new Date(horaEntradaEsperada.getTime() + toleranciaMs);

    let minutosTarde = 0;
    let estado: 'PRESENTE' | 'TARDANZA' = 'PRESENTE';

    if (ahora > limiteEntrada) {
      // Tardanza en minutos desde la hora de entrada (sin tolerancia)
      minutosTarde = Math.round(
        (ahora.getTime() - horaEntradaEsperada.getTime()) / 60000
      );
      estado = 'TARDANZA';
    }

    // 5. Crear el registro
    const registro = await this.asistenciaRepository.crearEntrada({
      empleadoId:   dto.empleadoId,
      fecha:        hoy,
      horaEntrada:  ahora,
      minutosTarde,
      estado,
    });

    return {
      ...registro,
      mensaje: estado === 'TARDANZA'
        ? `Entrada registrada con ${minutosTarde} minutos de tardanza`
        : 'Entrada registrada a tiempo ✅',
    };
  }

  // ── REGISTRAR SALIDA ───────────────────────────────
  async registrarSalida(dto: RegistrarSalidaDto) {
    const ahora = new Date();
    const hoy = this.obtenerFechaSinHora(ahora);

    // 1. Buscar el registro de entrada de hoy
    const registro = await this.asistenciaRepository
      .findByEmpleadoYFecha(dto.empleadoId, hoy);

    if (!registro) {
      throw new NotFoundException(
        'No hay registro de entrada para hoy. Registra la entrada primero.'
      );
    }

    if (!registro.horaEntrada) {
      throw new BadRequestException(
        'No hay hora de entrada registrada para hoy.'
      );
    }

    if (registro.horaSalida) {
      throw new ConflictException(
        'Ya registraste la salida hoy. No puedes fichar dos veces.'
      );
    }

    // 2. ── CALCULAR HORAS TRABAJADAS ─────────────────
    // horasTrabajadas = (horaSalida - horaEntrada) en horas
    const msTrabaJados = ahora.getTime() - registro.horaEntrada.getTime();
    const horasTrabajadas = Math.round((msTrabaJados / 3_600_000) * 100) / 100;

    // 3. Actualizar el registro con la salida
    const registroActualizado = await this.asistenciaRepository
      .registrarSalida(registro.id, ahora, horasTrabajadas);

    return {
      ...registroActualizado,
      mensaje: `Salida registrada. Horas trabajadas hoy: ${horasTrabajadas}h ✅`,
    };
  }

  // ── LISTAR REGISTROS ───────────────────────────────
  async findAll(filtros: FiltrarAsistenciaDto) {
    let mesInicio: Date | undefined;
    let mesFin: Date | undefined;

    // Si filtra por mes (formato "2026-03"), calculamos inicio y fin
    if (filtros.mes) {
      const [anio, mes] = filtros.mes.split('-').map(Number);
      mesInicio = new Date(anio, mes - 1, 1);   // primer día del mes
      mesFin    = new Date(anio, mes, 0);        // último día del mes
    }

    return this.asistenciaRepository.findAll({
      empleadoId: filtros.empleadoId,
      fecha:      filtros.fecha ? new Date(filtros.fecha) : undefined,
      mesInicio,
      mesFin,
    });
  }

  // ── HELPERS PRIVADOS ───────────────────────────────

  // Obtiene solo la fecha sin la hora: 2026-03-25T00:00:00.000Z
  private obtenerFechaSinHora(fecha: Date): Date {
    return new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate(),
    );
  }

  // Construye un Date combinando una fecha base con una hora string "HH:mm"
  // Ejemplo: fecha=2026-03-25, hora="08:00" → 2026-03-25T08:00:00
  private construirFechaConHora(fechaBase: Date, horaString: string): Date {
    const [horas, minutos] = horaString.split(':').map(Number);
    return new Date(
      fechaBase.getFullYear(),
      fechaBase.getMonth(),
      fechaBase.getDate(),
      horas,
      minutos,
      0,
    );
  }
}