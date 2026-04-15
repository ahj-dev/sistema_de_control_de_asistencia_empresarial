//Recibe las solicitudes relacionadas con los empleados.
//--------------------------------------------------------------
// El servicio de empleados es responsable de manejar la lógica de negocio relacionada con los empleados. 
// Recibe las solicitudes del controlador, valida los datos y se comunica con el repositorio para realizar las operaciones necesarias.
//--------------------------------------------------------------
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { EmpleadosRepository } from '../repository/empleados.repository';
import { DepartamentosRepository } from '../../departamentos/repository/departamentos.repository';
import { CreateEmpleadoDto } from '../dto/create-empleado.dto';
import { UpdateEmpleadoDto } from '../dto/update-empleado.dto';

@Injectable()
export class EmpleadosService {
  constructor(
    private readonly empleadosRepository: EmpleadosRepository,
    private readonly departamentosRepository: DepartamentosRepository,
  ) {}

  findAll() {
    return this.empleadosRepository.findAll();
  }

  async findOne(id: string) {
    const empleado = await this.empleadosRepository.findById(id);

    if (!empleado) {
      throw new NotFoundException(`Empleado con id ${id} no encontrado`);
    }

    return empleado;
  }

  async create(dto: CreateEmpleadoDto) {
    const cedulaExiste = await this.empleadosRepository.findByCedula(dto.cedula);

    if (cedulaExiste) {
      throw new ConflictException(
        `Ya existe un empleado con la cédula ${dto.cedula}`
      );
    }

    const departamento = await this.departamentosRepository.findById(
      dto.departamentoId,
    );

    if (!departamento) {
      throw new NotFoundException(
        `Departamento con id ${dto.departamentoId} no encontrado`
      );
    }

    return this.empleadosRepository.create(dto);
  }

  async update(id: string, dto: UpdateEmpleadoDto) {
    await this.findOne(id);

    if (dto.departamentoId) {
      const departamento = await this.departamentosRepository.findById(
        dto.departamentoId,
      );

      if (!departamento) {
        throw new NotFoundException(
          `Departamento con id ${dto.departamentoId} no encontrado`
        );
      }
    }

    return this.empleadosRepository.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.empleadosRepository.softDelete(id);
  }
}