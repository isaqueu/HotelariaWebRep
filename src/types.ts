// /src/types.ts

export interface LoginRequest {
  USERNAME: string;
  EMAIL: string;
  PASSWORD: string;
}

export interface RequestBody {
  message: string;
  data: LoginRequest[];
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: UserProfile;
}

export interface UserProfile {
  userId: number;
  username: string;
  email: string;
  permissions: Permission[];
}

export interface Permission {
  permission: string;
  url: string | null;
}

export interface CategoriaChamado {
  cd_categoria_chamado: number;
  ds_categoria_chamado: string;
  sn_ativo: 'S' | 'N';
}

export interface Dispositivo {
  cd_dispositivo: number;
  nm_dispositivo: string;
  tp_dispositivo: string;
  serial: string;
  app_versao_instalada: string;
  app_versao_atualizada: string;
  sn_ativo: 'S' | 'N';
  sn_atualizacao_liberada: 'S' | 'N';
}

export interface Etapa {
  cd_etapa: number;
  ds_etapa: string;
  ordem: number;
  cd_categoria_chamado: number;
  cd_tipo_operador: number;
  sn_ativo: 'S' | 'N';
  sn_le_qrcode: 'S' | 'N';
}

export interface ItemLeito {
  cd_item_leito: number;
  ds_item_leito: string;
  cd_item_local: number;
  sn_ativo: 'S' | 'N';
  sn_item_coletivo_enfermaria: 'S' | 'N';
  sn_item_checklist: 'S' | 'N';
}

export interface ItemLocal {
  cd_item_local: number;
  ds_item_local: string;
  sn_ativo: 'S' | 'N';
}

export interface TipoLimpeza {
  cd_tipo_limpeza: number;
  ds_tipo_limpeza: string;
  duracao_min: number;
  sn_ativo: 'S' | 'N';
}

export interface TipoOperador {
  cd_tipo_operador: number;
  ds_tipo_operador: string;
  sn_ativo: string;
}

export interface TipoAcesso {
  cd_tipo_acesso: number;
  ds_tipo_acesso: string;
  sn_ativo: string;
}

export interface StatusErroQrcode {
  cd_status_erro_qrcode: number;
  ds_status_erro_qrcode: string;
  cd_categoria_chamado: number;
  sn_ativo: 'S' | 'N';
}

export interface Operador {
  cd_operador: number;
  nm_operador: string;
  cd_usuario_sw: string;
  cod_empresa: number;
  sn_ativo: 'S' | 'N';
  sn_logado: 'S' | 'N';
}
