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

// Interceptor de respuesta:
// Si el servidor devuelve 401, redirige al login automáticamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;