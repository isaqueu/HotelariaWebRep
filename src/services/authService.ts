
import api from './api';
import type { LoginRequest, LoginResponse, RequestBody, UserProfile } from '../types';
import { encryptKey } from '@/lib/utils';




export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {

    credentials.password = await encryptKey(credentials.password);

    let requestBody: RequestBody = { message: '', data: [credentials] }

    const response = await api.post('/auth/login', requestBody);
    return response.data;
  },

  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async refreshToken(): Promise<LoginResponse> {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};
