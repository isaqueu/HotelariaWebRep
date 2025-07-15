
import api from './api';
import type { CategoriaChamado } from '../types';

export const categoriaChamadoService = {
  async getAll(): Promise<CategoriaChamado[]> {
    const response = await api.get('/api/categoria-chamado');
    return response.data;
  },

  async getById(id: number): Promise<CategoriaChamado> {
    const response = await api.get(`/api/categoria-chamado/${id}`);
    return response.data;
  },

  async create(data: Omit<CategoriaChamado, 'cd_categoria_chamado'>): Promise<CategoriaChamado> {
    const response = await api.post('/api/categoria-chamado', data);
    return response.data;
  },

  async update(id: number, data: Partial<CategoriaChamado>): Promise<CategoriaChamado> {
    const response = await api.put(`/api/categoria-chamado/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/categoria-chamado/${id}`);
  },
};
