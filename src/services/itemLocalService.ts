
import api from './api';
import type { ItemLocal } from '../types';

export const itemLocalService = {
  async getAll(): Promise<ItemLocal[]> {
    const response = await api.get('/api/item-local');
    return response.data;
  },

  async getById(id: number): Promise<ItemLocal> {
    const response = await api.get(`/api/item-local/${id}`);
    return response.data;
  },

  async create(data: Omit<ItemLocal, 'cd_item_local'>): Promise<ItemLocal> {
    const response = await api.post('/api/item-local', data);
    return response.data;
  },

  async update(id: number, data: Partial<ItemLocal>): Promise<ItemLocal> {
    const response = await api.put(`/api/item-local/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/item-local/${id}`);
  },
};
