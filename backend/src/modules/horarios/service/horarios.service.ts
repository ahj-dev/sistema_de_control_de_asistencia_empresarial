//Este servicio maneja la lógica de negocio relacionada con los horarios laborales como crear, actualizar, eliminar y obtener horarios.
//Utiliza el repositorio de horarios para interactuar con la base de datos a través de Prisma. 
// También incluye validaciones para evitar conflictos y asegurar la integridad de los datos.
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { HorariosRepository } from '../repository/horarios.repository';
import { CreateHorarioDto } from '../dto/create-horario.dto';
import { UpdateHorarioDto } from '../dto/update-horario.dto';

@Injectable()
export class HorariosService {
  constructor(private readonly horariosRepository: HorariosRepository) {}

  // Obtiene todos los horarios activos, ordenados por nombre y con el conteo de empleados asignados a cada horario
  findAll() {
    return this.horariosRepository.findAll();
  }

  // Obtiene un horario por su ID, incluyendo los empleados activos asignados a ese horario
  async findOne(id: string) {
    const horario = await this.horariosRepository.findById(id);

    if (!horario) {
      throw new NotFoundException(
        `Horario con id ${id} no encontrado`
      );
    }

    return horario;
  }
  // Crea un nuevo horario laboral, verificando que no exista otro con el mismo nombre y que la hora de entrada sea anterior a la hora de salida
  async create(dto: CreateHorarioDto) {
    // Verificar nombre duplicado
    const existe = await this.horariosRepository.findByNombre(dto.nombre);

    if (existe) {
      throw new ConflictException(
        `Ya existe un horario llamado "${dto.nombre}"`
      );
    }

    // Verificar que hora de entrada sea antes que hora de salida
    const [hEntrada] = dto.horaEntrada.split(':').map(Number);
    const [hSalida]  = dto.horaSalida.split(':').map(Number);

    if (hEntrada >= hSalida) {
      throw new BadRequestException(
        'La hora de entrada debe ser anterior a la hora de salida'
      );
    }

    return this.horariosRepository.create(dto);
  }
  // Actualiza un horario existente, verificando que el horario exista, que no haya otro con el mismo nombre (si se cambia el nombre) y que la hora de entrada sea anterior a la hora de salida (si se cambian las horas)
  async update(id: string, dto: UpdateHorarioDto) {
    await this.findOne(id);
    return this.horariosRepository.update(id, dto);
  }
 // Elimina (desactiva) un horario, verificando que el horario exista y que no tenga empleados activos asignados antes de desactivarlo
  async remove(id: string) {
    const horario = await this.findOne(id);

    // No desactivar si tiene empleados asignados
    if ((horario as any)._count?.empleados > 0) {
      throw new ConflictException(
        'No se puede desactivar un horario con empleados asignados'
      );
    }

    return this.horariosRepository.softDelete(id);
  }
}