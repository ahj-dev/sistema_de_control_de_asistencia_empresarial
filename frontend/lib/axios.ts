import axios from 'axios';

// Instancia de Axios configurada con la URL base de la API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de petición:
// Antes de CADA petición, agrega el token JWT automáticamente
api.interceptors.request.use((config) => {
  // El token se guarda en localStorage cuando el usuario hace login
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Ahora todas las respuestas tienen { success, data, timestamp }
// Extraemos solo el "data" para que los servicios reciban
// directamente los datos sin tener que hacer response.data.data
api.interceptors.response.use(
  (response) => {
    // Si la respuesta tiene el formato del TransformInterceptor
    // devolvemos solo el campo "data"
    if (response.data && response.data.success !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    // Si la respuesta es un error 401 (Unauthorized), redirigimos al login
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;