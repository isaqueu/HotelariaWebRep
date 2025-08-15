
import api from './api';
import type { LoginRequest, LoginResponse, RequestBody, UserProfile } from '../types';
import { encryptKey, getRefreshToken } from '@/lib/utils';




export const authService = {
  async loginService(credentials: LoginRequest): Promise<LoginResponse> {

    console.log('🔒 [authService] Criptografando senha...');
    credentials.PASSWORD = await encryptKey(credentials.PASSWORD)

    let requestBody: RequestBody = { message: 'Autenticação de usuário.', data: [credentials] };

    try {
      const response = await api.post('/auth/login', requestBody);
     
      return response.data;
    } catch (error) {
      console.error('💥 [authService] Erro na requisição de login:', error);
      throw error;
    }
  },

  async getProfile(): Promise<UserProfile> {

    // Passado nome da aplicação para retornar somente as permissões da aplicação ou permissões que
    // não estão associadas as nenhuma aplicação mas tem no usuário
    const headers = {
      'x-empresa': 'HOTELARIAAPP'
    };
    
    try {
      console.log('🚀 [authService] Enviando requisição para /auth/profile...');
      const response = await api.post('/auth/profile', {}, { headers });
      
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

  async renovaTokenService(): Promise<LoginResponse> {
    console.log('🔄 [authService] Renovando token...');
    const refreshToken = getRefreshToken();

    try {
      // Estrutura o objeto de acordo com o schema esperado pelo SCMM-CORE
      const requestBody = { token: refreshToken };
      const response = await api.post('/auth/refresh-token', requestBody);
           
      return response.data;
    } catch (error) {
      console.error('💥 [authService] Erro ao renovar token:', error);
      throw error;
    }
  },
};
