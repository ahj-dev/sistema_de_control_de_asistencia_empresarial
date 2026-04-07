// Estos tipos reflejan exactamente lo que devuelve la API

export type Rol = 'EMPLEADO' | 'JEFE_DEPARTAMENTO' | 'RRHH' | 'ADMINISTRADOR';

export type EstadoEmpleado = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO' | 'VACACIONES';

export interface Departamento {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  created_at: string;
  _count?: {
    empleados: number;
  };
}

export interface Empleado {
  id: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono?: string;
  fechaNacimiento?: string;
  fechaIngreso: string;
  estado: EstadoEmpleado;
  departamento: {
    id: string;
    nombre: string;
  };
}

export interface Usuario {
  id: string;
  email: string;
  rol: Rol;
}

export interface LoginResponse {
  accessToken: string;
  usuario: Usuario;
}