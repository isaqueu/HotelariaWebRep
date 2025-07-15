
import api from './api';
import type { TipoOperador } from '../types';

export const tipoOperadorService = {
  async getAll(): Promise<TipoOperador[]> {
    const response = await api.get('/api/tipo-operador');
    return response.data;
  },

  async getById(id: number): Promise<TipoOperador> {
    const response = await api.get(`/api/tipo-operador/${id}`);
    return response.data;
  },

  async create(data: Omit<TipoOperador, 'cd_tipo_operador'>): Promise<TipoOperador> {
    const response = await api.post('/api/tipo-operador', data);
    return response.data;
  },

  async update(id: number, data: Partial<TipoOperador>): Promise<TipoOperador> {
    const response = await api.put(`/api/tipo-operador/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/tipo-operador/${id}`);
  },
};
