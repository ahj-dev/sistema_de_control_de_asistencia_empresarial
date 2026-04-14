//recibe la peticion del usuario.
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { DepartamentosRepository } from '../repository/departamentos.repository';
import { CreateDepartamentoDto } from '../dto/create-departamento.dto';
import { UpdateDepartamentoDto } from '../dto/update-departamento.dto';

@Injectable()
export class DepartamentosService {
  constructor(
    private readonly departamentosRepository: DepartamentosRepository,
  ) {}

  findAll() {
    return this.departamentosRepository.findAll();
  }

  async findOne(id: string) {
    const departamento = await this.departamentosRepository.findById(id);

    if (!departamento) {
      throw new NotFoundException(
        `Departamento con id ${id} no encontrado`
      );
    }

    return departamento;
  }

  async create(dto: CreateDepartamentoDto) {
    const existe = await this.departamentosRepository.findByNombre(dto.nombre);

    if (existe) {
      throw new ConflictException(
        `Ya existe un departamento llamado "${dto.nombre}"`
      );
    }

    return this.departamentosRepository.create(dto);
  }

  async update(id: string, dto: UpdateDepartamentoDto) {
    await this.findOne(id);
    return this.departamentosRepository.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.departamentosRepository.softDelete(id);
  }
}