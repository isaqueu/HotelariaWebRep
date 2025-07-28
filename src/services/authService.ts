
import api from './api';
import type { LoginRequest, LoginResponse, RequestBody, UserProfile } from '../types';
import { encryptKey } from '@/lib/utils';




export const authService = {
  async loginService(credentials: LoginRequest): Promise<LoginResponse> {

    console.log('🔒 [authService] Criptografando senha...');
    credentials.PASSWORD = await encryptKey(credentials.PASSWORD)

    let requestBody: RequestBody = { message: 'Autenticação de usuário.', data: [credentials] };

    try {
      const response = await api.post('/auth/login', requestBody);
      //console.log('📨 [authService] Resposta recebida:');
      //console.log(response);
      
      
      // console.log('📨 [authService] Resposta recebida:', {
      //   status: response.status,
      //   statusText: response.statusText,
      //   data: {
      //     access_token: response.data.access_token ? 'PRESENTE' : 'AUSENTE',
      //     refresh_token: response.data.refresh_token ? 'PRESENTE' : 'AUSENTE',
      //     user: response.data.user ? 'PRESENTE' : 'AUSENTE'
      //   }
      // });
      
      return response.data;
    } catch (error) {
      console.error('💥 [authService] Erro na requisição de login:', error);
      throw error;
    }
  },

  async getProfile(): Promise<UserProfile> {
    
    try {
      console.log('🚀 [authService] Enviando requisição para /auth/profile...');
      const response = await api.post('/auth/profile');
      
      // console.log('📨 [authService] Perfil recebido:', {
      //   status: response.status,
      //   statusText: response.statusText,
      //   data: response.data
      // });
      
      return response.data;
    } catch (error) {
      console.error('💥 [authService] Erro ao buscar perfil:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('💥 [authService] Erro no logout:', error);
      throw error;
    }
  },

  async refreshToken(): Promise<LoginResponse> {
    console.log('🔄 [authService] Renovando token...');
    
    try {
      console.log('🚀 [authService] Enviando requisição para /auth/refresh...');
      const response = await api.post('/auth/refresh');
      
      console.log('📨 [authService] Token renovado:', {
        status: response.status,
        statusText: response.statusText,
        data: {
          access_token: response.data.access_token ? 'PRESENTE' : 'AUSENTE',
          refresh_token: response.data.refresh_token ? 'PRESENTE' : 'AUSENTE'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('💥 [authService] Erro ao renovar token:', error);
      throw error;
    }
  },
};
