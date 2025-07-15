import { apiRequest } from '@/lib/queryClient';
import type {
  LoginInfo,
  UserProfile,
  CategoriaChamado,
  Dispositivo,
  Etapa,
  ItemLeito,
  ItemLocal,
  TipoLimpeza,
  TipoOperador,
  TipoAcesso,
  StatusErroQrcode,
  Operador,
} from '../types';

export const authApi = {
  login: async (credentials: LoginInfo): Promise<UserProfile> => {
    const response = await apiRequest('POST', '/api/auth/login', credentials);
    return response.json();
  },
  logout: async (): Promise<void> => {
    await apiRequest('POST', '/api/auth/logout');
  },
};

export const categoriaChamadoApi = {
  getAll: async (): Promise<CategoriaChamado[]> => {
    const response = await apiRequest('GET', '/api/categoria-chamado');
    return response.json();
  },
  create: async (data: Omit<CategoriaChamado, 'cd_categoria_chamado'>): Promise<CategoriaChamado> => {
    const response = await apiRequest('POST', '/api/categoria-chamado', data);
    return response.json();
  },
  update: async (id: number, data: Partial<CategoriaChamado>): Promise<CategoriaChamado> => {
    const response = await apiRequest('PUT', `/api/categoria-chamado/${id}`, data);
    return response.json();
  },
  delete: async (id: number): Promise<void> => {
    await apiRequest('DELETE', `/api/categoria-chamado/${id}`);
  },
};

export const dispositivoApi = {
  getAll: async (): Promise<Dispositivo[]> => {
    const response = await apiRequest('GET', '/api/dispositivo');
    return response.json();
  },
  create: async (data: Omit<Dispositivo, 'cd_dispositivo'>): Promise<Dispositivo> => {
    const response = await apiRequest('POST', '/api/dispositivo', data);
    return response.json();
  },
  update: async (id: number, data: Partial<Dispositivo>): Promise<Dispositivo> => {
    const response = await apiRequest('PUT', `/api/dispositivo/${id}`, data);
    return response.json();
  },
  delete: async (id: number): Promise<void> => {
    await apiRequest('DELETE', `/api/dispositivo/${id}`);
  },
};

export const etapaApi = {
  getAll: async (): Promise<Etapa[]> => {
    const response = await apiRequest('GET', '/api/etapa');
    return response.json();
  },
  create: async (data: Omit<Etapa, 'cd_etapa'>): Promise<Etapa> => {
    const response = await apiRequest('POST', '/api/etapa', data);
    return response.json();
  },
  update: async (id: number, data: Partial<Etapa>): Promise<Etapa> => {
    const response = await apiRequest('PUT', `/api/etapa/${id}`, data);
    return response.json();
  },
  delete: async (id: number): Promise<void> => {
    await apiRequest('DELETE', `/api/etapa/${id}`);
  },
};

export const itemLeitoApi = {
  getAll: async (): Promise<ItemLeito[]> => {
    const response = await apiRequest('GET', '/api/item-leito');
    return response.json();
  },
  create: async (data: Omit<ItemLeito, 'cd_item_leito'>): Promise<ItemLeito> => {
    const response = await apiRequest('POST', '/api/item-leito', data);
    return response.json();
  },
  update: async (id: number, data: Partial<ItemLeito>): Promise<ItemLeito> => {
    const response = await apiRequest('PUT', `/api/item-leito/${id}`, data);
    return response.json();
  },
  delete: async (id: number): Promise<void> => {
    await apiRequest('DELETE', `/api/item-leito/${id}`);
  },
};

export const itemLocalApi = {
  getAll: async (): Promise<ItemLocal[]> => {
    const response = await apiRequest('GET', '/api/item-local');
    return response.json();
  },
  create: async (data: Omit<ItemLocal, 'cd_item_local'>): Promise<ItemLocal> => {
    const response = await apiRequest('POST', '/api/item-local', data);
    return response.json();
  },
  update: async (id: number, data: Partial<ItemLocal>): Promise<ItemLocal> => {
    const response = await apiRequest('PUT', `/api/item-local/${id}`, data);
    return response.json();
  },
  delete: async (id: number): Promise<void> => {
    await apiRequest('DELETE', `/api/item-local/${id}`);
  },
};

export const tipoLimpezaApi = {
  getAll: async (): Promise<TipoLimpeza[]> => {
    const response = await apiRequest('GET', '/api/tipo-limpeza');
    return response.json();
  },
  create: async (data: Omit<TipoLimpeza, 'cd_tipo_limpeza'>): Promise<TipoLimpeza> => {
    const response = await apiRequest('POST', '/api/tipo-limpeza', data);
    return response.json();
  },
  update: async (id: number, data: Partial<TipoLimpeza>): Promise<TipoLimpeza> => {
    const response = await apiRequest('PUT', `/api/tipo-limpeza/${id}`, data);
    return response.json();
  },
  delete: async (id: number): Promise<void> => {
    await apiRequest('DELETE', `/api/tipo-limpeza/${id}`);
  },
};

export const tipoOperadorApi = {
  getAll: async (): Promise<TipoOperador[]> => {
    const response = await apiRequest('GET', '/api/tipo-operador');
    return response.json();
  },
  create: async (data: Omit<TipoOperador, 'cd_tipo_operador'>): Promise<TipoOperador> => {
    const response = await apiRequest('POST', '/api/tipo-operador', data);
    return response.json();
  },
  update: async (id: number, data: Partial<TipoOperador>): Promise<TipoOperador> => {
    const response = await apiRequest('PUT', `/api/tipo-operador/${id}`, data);
    return response.json();
  },
  delete: async (id: number): Promise<void> => {
    await apiRequest('DELETE', `/api/tipo-operador/${id}`);
  },
};

export const tipoAcessoApi = {
  getAll: async (): Promise<TipoAcesso[]> => {
    const response = await apiRequest('GET', '/api/tipo-acesso');
    return response.json();
  },
  create: async (data: Omit<TipoAcesso, 'cd_tipo_acesso'>): Promise<TipoAcesso> => {
    const response = await apiRequest('POST', '/api/tipo-acesso', data);
    return response.json();
  },
  update: async (id: number, data: Partial<TipoAcesso>): Promise<TipoAcesso> => {
    const response = await apiRequest('PUT', `/api/tipo-acesso/${id}`, data);
    return response.json();
  },
  delete: async (id: number): Promise<void> => {
    await apiRequest('DELETE', `/api/tipo-acesso/${id}`);
  },
};

export const statusErroQrcodeApi = {
  getAll: async (): Promise<StatusErroQrcode[]> => {
    const response = await apiRequest('GET', '/api/status-erro-qrcode');
    return response.json();
  },
  create: async (data: Omit<StatusErroQrcode, 'cd_status_erro_qrcode'>): Promise<StatusErroQrcode> => {
    const response = await apiRequest('POST', '/api/status-erro-qrcode', data);
    return response.json();
  },
  update: async (id: number, data: Partial<StatusErroQrcode>): Promise<StatusErroQrcode> => {
    const response = await apiRequest('PUT', `/api/status-erro-qrcode/${id}`, data);
    return response.json();
  },
  delete: async (id: number): Promise<void> => {
    await apiRequest('DELETE', `/api/status-erro-qrcode/${id}`);
  },
};

export const operadorApi = {
  getAll: async (): Promise<Operador[]> => {
    const response = await apiRequest('GET', '/api/operador');
    return response.json();
  },
  create: async (data: Omit<Operador, 'cd_operador'>): Promise<Operador> => {
    const response = await apiRequest('POST', '/api/operador', data);
    return response.json();
  },
  update: async (id: number, data: Partial<Operador>): Promise<Operador> => {
    const response = await apiRequest('PUT', `/api/operador/${id}`, data);
    return response.json();
  },
  delete: async (id: number): Promise<void> => {
    await apiRequest('DELETE', `/api/operador/${id}`);
  },
};
