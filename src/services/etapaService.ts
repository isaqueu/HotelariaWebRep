
import api from './api';
import type { Etapa } from '../types';

export const etapaService = {
  async getAll(): Promise<Etapa[]> {
    const response = await api.get('/api/etapa');
    return response.data;
  },

  async getById(id: number): Promise<Etapa> {
    const response = await api.get(`/api/etapa/${id}`);
    return response.data;
  },

  async create(data: Omit<Etapa, 'cd_etapa'>): Promise<Etapa> {
    const response = await api.post('/api/etapa', data);
    return response.data;
  },

  async update(id: number, data: Partial<Etapa>): Promise<Etapa> {
    const response = await api.put(`/api/etapa/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/etapa/${id}`);
  },
};
