
import api from './api';
import type { LoginRequest, LoginResponse, RequestBody, UserProfile } from '../types';
import { encryptKey } from '@/lib/utils';




export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('🔄 [authService] Iniciando login...');
    console.log('📝 [authService] Credenciais recebidas:', {
      username: credentials.username,
      password: credentials.password ? '***' : 'vazio'
    });

    console.log('🔒 [authService] Criptografando senha...');
    credentials.password = await encryptKey(credentials.password);
    console.log('✅ [authService] Senha criptografada com sucesso');

    let requestBody: RequestBody = { message: '', data: [credentials] };
    console.log('📦 [authService] Corpo da requisição preparado:', {
      message: requestBody.message,
      data: requestBody.data.map(d => ({ username: d.username, password: '***' }))
    });

    try {
      console.log('🚀 [authService] Enviando requisição para /auth/login...');
      const response = await api.post('/auth/login', requestBody);
      
      console.log('📨 [authService] Resposta recebida:', {
        status: response.status,
        statusText: response.statusText,
        data: {
          access_token: response.data.access_token ? 'PRESENTE' : 'AUSENTE',
          refresh_token: response.data.refresh_token ? 'PRESENTE' : 'AUSENTE',
          user: response.data.user ? 'PRESENTE' : 'AUSENTE'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('💥 [authService] Erro na requisição de login:', error);
      throw error;
    }
  },

  async getProfile(): Promise<UserProfile> {
    console.log('🔄 [authService] Buscando perfil do usuário...');
    
    try {
      console.log('🚀 [authService] Enviando requisição para /auth/profile...');
      const response = await api.get('/auth/profile');
      
      console.log('📨 [authService] Perfil recebido:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('💥 [authService] Erro ao buscar perfil:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    console.log('🔄 [authService] Fazendo logout...');
    
    try {
      console.log('🚀 [authService] Enviando requisição para /auth/logout...');
      await api.post('/auth/logout');
      console.log('✅ [authService] Logout realizado com sucesso');
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
