
import api from './api';
import type { TipoAcesso } from '../types';

export const tipoAcessoService = {
  async getAll(): Promise<TipoAcesso[]> {
    const response = await api.get('/api/tipo-acesso');
    return response.data;
  },

  async getById(id: number): Promise<TipoAcesso> {
    const response = await api.get(`/api/tipo-acesso/${id}`);
    return response.data;
  },

  async create(data: Omit<TipoAcesso, 'cd_tipo_acesso'>): Promise<TipoAcesso> {
    const response = await api.post('/api/tipo-acesso', data);
    return response.data;
  },

  async update(id: number, data: Partial<TipoAcesso>): Promise<TipoAcesso> {
    const response = await api.put(`/api/tipo-acesso/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/tipo-acesso/${id}`);
  },
};
