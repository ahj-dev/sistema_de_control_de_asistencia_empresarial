//Este servicio es el encargado de manejar todas las operaciones relacionadas con los horarios, 
//como obtener la lista de horarios, crear un nuevo horario, actualizar la información de un horario existente y eliminar un horario.
//Utiliza una instancia de Axios configurada para hacer las solicitudes HTTP al backend, lo que nos permite mantener el código limpio y organizado.
import api from '@/lib/axios';

export const horariosService = {
  getAll: async () => {
    const response = await api.get('/horarios');
    return response.data;
  },

  create: async (data: {
    nombre: string;
    horaEntrada: string;
    horaSalida: string;
    toleranciaMin: number;
    diasLaborables: object;
  }) => {
    const response = await api.post('/horarios', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/horarios/${id}`, data);
    return response.data;
  },

  remove: async (id: string) => {
    const response = await api.delete(`/horarios/${id}`);
    return response.data;
  },
};