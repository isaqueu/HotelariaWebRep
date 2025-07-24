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

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  (config) => {
    console.log('🔄 [API] Interceptando requisição...');
    console.log('📝 [API] Detalhes da requisição:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL
    });

    const token = getAuthToken();
    console.log('🔑 [API] Token encontrado:', token ? 'SIM' : 'NÃO');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ [API] Token adicionado ao header Authorization');
    }

    return config;
  },
  (error) => {
    console.error('💥 [API] Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas e erros
// api.interceptors.response.use(
//   (response) => {
//     console.log('✅ [API] Resposta recebida com sucesso:', {
//       status: response.status,
//       statusText: response.statusText,
//       url: response.config.url,
//       method: response.config.method?.toUpperCase()
//     });
//     return response;
//   },
//   async (error) => {
//     console.error('💥 [API] Erro na resposta:', {
//       status: error.response?.status,
//       statusText: error.response?.statusText,
//       url: error.config?.url,
//       method: error.config?.method?.toUpperCase(),
//       message: error.message
//     });

//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       console.log('🔄 [API] Erro 401 detectado - tentando renovar token...');
//       originalRequest._retry = true;

//       try {
//         const refreshToken = getRefreshToken();
//         console.log('🔑 [API] Refresh token encontrado:', refreshToken ? 'SIM' : 'NÃO');

//         if (refreshToken) {
//           console.log('🚀 [API] Enviando requisição para renovar token...');
//           const response = await axios.post(`${(import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3000'}/auth/refresh`, {
//             refresh_token: refreshToken
//           });

//           console.log('✅ [API] Token renovado com sucesso');
//           const { access_token } = response.data;
//           localStorage.setItem('hotelaria_auth_token', access_token)

//           console.log('🔄 [API] Reenviando requisição original com novo token...');
//           originalRequest.headers.Authorization = `Bearer ${access_token}`;
//           return api(originalRequest);
//         }
//       } catch (refreshError) {
//         console.error('💥 [API] Erro ao renovar token:', refreshError);
//         console.log('🧹 [API] Removendo tokens e redirecionando para login...');
//         localStorage.removeItem('hotelaria_auth_token');
//         localStorage.removeItem('hotelaria_refresh_token');
//         window.location.href = '/login';
//       }
//     }

//     return Promise.reject(error);
//   }
// );

//  Trata os erros, incluindo redirecionamento ao login para status 401.
api.interceptors.response.use(
  (response) => response, // Retorna a resposta normalmente caso não haja erros
  (error) => {
    // Trata erros de resposta
    if (error.response?.status === 401) {
      console.warn('Sessão expirada. Redirecionando para a página de login...');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const makeRequest = async (endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any,): Promise<any> => {
  try {
    //console.log(`Enviando requisição para ${endpoint} com dados:`, data);
    const response = await api.request({
      url: endpoint,
      method,
      data,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      `Erro ao fazer requisição para ${endpoint}:`,
      error.response || error,
    );
    throw new Error(
      error.response?.data?.message ||
      `Erro ${error.response?.status || ''} ao acessar ${endpoint}`,
    );
  }
};

export default api;