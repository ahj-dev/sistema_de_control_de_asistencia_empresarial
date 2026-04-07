import api from '@/lib/axios';
import { Departamento } from '@/types';

export const departamentosService = {
  // Obtener todos
  getAll: async (): Promise<Departamento[]> => {
    const response = await api.get('/departamentos');
    return response.data;
  },

  // Obtener uno por ID
  getOne: async (id: string): Promise<Departamento> => {
    const response = await api.get(`/departamentos/${id}`);
    return response.data;
  },

  // Crear
  create: async (data: { nombre: string; descripcion?: string }) => {
    const response = await api.post('/departamentos', data);
    return response.data;
  },

  // Actualizar
  update: async (id: string, data: Partial<Departamento>) => {
    const response = await api.patch(`/departamentos/${id}`, data);
    return response.data;
  },

  // Eliminar
  remove: async (id: string) => {
    const response = await api.delete(`/departamentos/${id}`);
    return response.data;
  },
};