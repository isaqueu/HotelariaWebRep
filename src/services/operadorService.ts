
import api from './api';
import type { Operador } from '../types';

export const operadorService = {
  async getAll(): Promise<Operador[]> {
    const response = await api.get('/api/operador');
    return response.data;
  },

  async getById(id: number): Promise<Operador> {
    const response = await api.get(`/api/operador/${id}`);
    return response.data;
  },

  async create(data: Omit<Operador, 'cd_operador'>): Promise<Operador> {
    const response = await api.post('/api/operador', data);
    return response.data;
  },

  async update(id: number, data: Partial<Operador>): Promise<Operador> {
    const response = await api.put(`/api/operador/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/operador/${id}`);
  },
};
