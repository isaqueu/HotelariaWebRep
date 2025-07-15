
import api from './api';
import type { ItemLeito } from '../types';

export const itemLeitoService = {
  async getAll(): Promise<ItemLeito[]> {
    const response = await api.get('/api/item-leito');
    return response.data;
  },

  async getById(id: number): Promise<ItemLeito> {
    const response = await api.get(`/api/item-leito/${id}`);
    return response.data;
  },

  async create(data: Omit<ItemLeito, 'cd_item_leito'>): Promise<ItemLeito> {
    const response = await api.post('/api/item-leito', data);
    return response.data;
  },

  async update(id: number, data: Partial<ItemLeito>): Promise<ItemLeito> {
    const response = await api.put(`/api/item-leito/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/item-leito/${id}`);
  },
};
