
import api from './api';
import type { StatusErroQrcode } from '../types';

export const statusErroQrcodeService = {
  async getAll(): Promise<StatusErroQrcode[]> {
    const response = await api.get('/api/status-erro-qrcode');
    return response.data;
  },

  async getById(id: number): Promise<StatusErroQrcode> {
    const response = await api.get(`/api/status-erro-qrcode/${id}`);
    return response.data;
  },

  async create(data: Omit<StatusErroQrcode, 'cd_status_erro_qrcode'>): Promise<StatusErroQrcode> {
    const response = await api.post('/api/status-erro-qrcode', data);
    return response.data;
  },

  async update(id: number, data: Partial<StatusErroQrcode>): Promise<StatusErroQrcode> {
    const response = await api.put(`/api/status-erro-qrcode/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/status-erro-qrcode/${id}`);
  },
};
