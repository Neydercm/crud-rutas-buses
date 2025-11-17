import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configuración base de axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de errores
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return Promise.reject(error);
  }
);

export const rutaBusService = {
  // Obtener todas las rutas
  getAll: async (params = {}) => {
    const response = await api.get('/rutas', { params });
    return response.data;
  },

  // Obtener ruta por ID
  getById: async (id) => {
    const response = await api.get(`/rutas/${id}`);
    return response.data;
  },

  // Crear nueva ruta
  create: async (data) => {
    const response = await api.post('/rutas', data);
    return response.data;
  },

  // Actualizar ruta
  update: async (id, data) => {
    const response = await api.put(`/rutas/${id}`, data);
    return response.data;
  },

  // Eliminar ruta (borrado lógico)
  delete: async (id) => {
    const response = await api.delete(`/rutas/${id}`);
    return response.data;
  },

  // Obtener estadísticas
  getEstadisticas: async () => {
    const response = await api.get('/rutas/estadisticas');
    return response.data;
  },

  // Exportar XML (Método 1)
  exportXMLMetodo1: async () => {
    const response = await api.get('/rutas/export/xml', {
      responseType: 'blob' // Para descargar archivo
    });
    return response.data;
  },

  // Exportar XML (Método 2)
  exportXMLMetodo2: async () => {
    const response = await api.get('/rutas/export/xml-directo', {
      responseType: 'blob'
    });
    return response.data;
  }
};

export default rutaBusService;