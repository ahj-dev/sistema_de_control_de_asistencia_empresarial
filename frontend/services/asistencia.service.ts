// Servicio para gestionar la asistencia de empleados
// Proporciona funciones para registrar entradas y salidas, así como para obtener registros de asistencia con filtros
import api from '@/lib/axios';

export const asistenciaService = {
  registrarEntrada: async (empleadoId: string) => {
    const response = await api.post('/asistencia/entrada', { empleadoId });
    return response.data;
  },

  registrarSalida: async (empleadoId: string) => {
    const response = await api.post('/asistencia/salida', { empleadoId });
    return response.data;
  },

  getAll: async (filtros?: {
    empleadoId?: string;
    fecha?: string;
    mes?: string;
  }) => {
    const params = new URLSearchParams();
    if (filtros?.empleadoId) params.append('empleadoId', filtros.empleadoId);
    if (filtros?.fecha)      params.append('fecha',      filtros.fecha);
    if (filtros?.mes)        params.append('mes',        filtros.mes);
    const response = await api.get(`/asistencia?${params.toString()}`);
    return response.data;
  },
};