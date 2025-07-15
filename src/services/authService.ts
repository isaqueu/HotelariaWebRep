
import api from './api';
import type { UserProfile } from '../types';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: UserProfile;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/auth/login', credentials);
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
