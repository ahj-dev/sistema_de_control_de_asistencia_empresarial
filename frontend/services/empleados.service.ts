//Este servicio es el encargado de manejar todas las operaciones relacionadas con los empleados, 
//como obtener la lista de empleados, crear un nuevo empleado, actualizar la información de un empleado existente y eliminar un empleado.
//Utiliza una instancia de Axios configurada para hacer las solicitudes HTTP al backend, lo que nos permite mantener el código limpio y organizado.
import api from '@/lib/axios';

export const empleadosService = {
  getAll: async () => {
    const response = await api.get('/empleados');
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await api.get(`/empleados/${id}`);
    return response.data;
  },

  create: async (data: {
    nombres: string;
    apellidos: string;
    cedula: string;
    telefono?: string;
    fechaIngreso: string;
    fechaNacimiento?: string;
    departamentoId: string;
    horarioId?: string;
  }) => {
    const response = await api.post('/empleados', data);
    return response.data;
  },

  update: async (id: string, data: Partial<{
    nombres: string;
    apellidos: string;
    telefono: string;
    departamentoId: string;
    horarioId: string;
  }>) => {
    const response = await api.patch(`/empleados/${id}`, data);
    return response.data;
  },

  remove: async (id: string) => {
    const response = await api.delete(`/empleados/${id}`);
    return response.data;
  },
};