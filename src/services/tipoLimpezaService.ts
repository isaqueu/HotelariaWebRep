
import api from './api';
import type { TipoLimpeza } from '../types';

export const tipoLimpezaService = {
  async getAll(): Promise<TipoLimpeza[]> {
    const response = await api.get('/api/tipo-limpeza');
    return response.data;
  },

  async getById(id: number): Promise<TipoLimpeza> {
    const response = await api.get(`/api/tipo-limpeza/${id}`);
    return response.data;
  },

  async create(data: Omit<TipoLimpeza, 'cd_tipo_limpeza'>): Promise<TipoLimpeza> {
    const response = await api.post('/api/tipo-limpeza', data);
    return response.data;
  },

  async update(id: number, data: Partial<TipoLimpeza>): Promise<TipoLimpeza> {
    const response = await api.put(`/api/tipo-limpeza/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/tipo-limpeza/${id}`);
  },
};
