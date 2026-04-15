//recibe la peticion del usuario, contiene la logica de negocio y se comunica con el repositorio para acceder a la base de datos
//Aqui se valida si por ejemplo, si el nombre del departamento existe, si el departamento existe antes de actualizar o eliminar, etc.
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