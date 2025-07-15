import { getAuthToken } from '@/lib/utils';
import axios from 'axios';

// Configuração do Axios
const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3000',
  timeout: Number((import.meta as any).env?.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      const tokenKey = (import.meta as any).env?.VITE_TOKEN_STORAGE_KEY || 'hotelaria_auth_token';
      localStorage.removeItem(tokenKey);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;