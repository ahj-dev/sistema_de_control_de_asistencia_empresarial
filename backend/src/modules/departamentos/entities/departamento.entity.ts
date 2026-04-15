//Ejecuta las consultas a PostgreSQL relacionadas con los departamentos, como crear un nuevo departamento,
//actualizar la información de un departamento existente, eliminar un departamento o consultar la lista de departamentos.
//Este repositorio se encarga de interactuar directamente con la base de datos utilizando el cliente de PostgreSQL para ejecutar las consultas SQL necesarias para gestionar los departamentos en el sistema.
export class Departamento {
  id!: string;
  nombre!: string;
  descripcion?: string;
  activo!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}