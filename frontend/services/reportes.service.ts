//este servicio se encarga de hacer las peticiones a la API para obtener los reportes mensuales de los empleados
import api from '@/lib/axios';

export const reportesService = {
  getMensual: async (empleadoId: string, mes: string) => {
    const response = await api.get(
      `/reportes/mensual?empleadoId=${empleadoId}&mes=${mes}`
    );
    return response.data;
  },
};