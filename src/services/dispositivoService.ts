
import api from './api';
import type { Dispositivo } from '../types';

export const dispositivoService = {
  async getAll(): Promise<Dispositivo[]> {
    const response = await api.get('/api/dispositivo');
    return response.data;
  },

  async getById(id: number): Promise<Dispositivo> {
    const response = await api.get(`/api/dispositivo/${id}`);
    return response.data;
  },

  async create(data: Omit<Dispositivo, 'cd_dispositivo'>): Promise<Dispositivo> {
    const response = await api.post('/api/dispositivo', data);
    return response.data;
  },

  async update(id: number, data: Partial<Dispositivo>): Promise<Dispositivo> {
    const response = await api.put(`/api/dispositivo/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/dispositivo/${id}`);
  },
};
