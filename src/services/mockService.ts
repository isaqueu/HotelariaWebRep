import type {
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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  login: async (username: string, password: string): Promise<UserProfile | null> => {
    await delay(500);
    if (username && password) {
      return {
        userId: 1,
        username,
        email: `${username}@hospital.com`,
        permissions: [
          { permission: 'admin', url: null },
          { permission: 'read', url: null },
          { permission: 'write', url: null },
        ],
      };
    }
    return null;
  },
};

export const mockDataService = {
  categoriasChamado: [
    { cd_categoria_chamado: 1, ds_categoria_chamado: 'Limpeza Geral', sn_ativo: 'S' },
    { cd_categoria_chamado: 2, ds_categoria_chamado: 'Manutenção', sn_ativo: 'S' },
    { cd_categoria_chamado: 3, ds_categoria_chamado: 'Suporte Técnico', sn_ativo: 'S' },
  ] as CategoriaChamado[],
  dispositivos: [
    { cd_dispositivo: 1, nm_dispositivo: 'Tablet Enfermaria 01', tp_dispositivo: 'Tablet', serial: 'TB001', app_versao_instalada: '1.0.0', app_versao_atualizada: '1.1.0', sn_ativo: 'S', sn_atualizacao_liberada: 'S' },
    { cd_dispositivo: 2, nm_dispositivo: 'Smartphone Limpeza 01', tp_dispositivo: 'Smartphone', serial: 'SM001', app_versao_instalada: '1.0.0', app_versao_atualizada: '1.1.0', sn_ativo: 'S', sn_atualizacao_liberada: 'N' },
  ] as Dispositivo[],
  etapas: [
    { cd_etapa: 1, ds_etapa: 'Verificação Inicial', ordem: 1, cd_categoria_chamado: 1, cd_tipo_operador: 1, sn_ativo: 'S', sn_le_qrcode: 'S' },
    { cd_etapa: 2, ds_etapa: 'Limpeza Detalhada', ordem: 2, cd_categoria_chamado: 1, cd_tipo_operador: 1, sn_ativo: 'S', sn_le_qrcode: 'N' },
  ] as Etapa[],
  itensLeito: [
    { cd_item_leito: 1, ds_item_leito: 'Colchão', cd_item_local: 1, sn_ativo: 'S', sn_item_coletivo_enfermaria: 'N', sn_item_checklist: 'S' },
    { cd_item_leito: 2, ds_item_leito: 'Travesseiro', cd_item_local: 1, sn_ativo: 'S', sn_item_coletivo_enfermaria: 'N', sn_item_checklist: 'S' },
  ] as ItemLeito[],
  itensLocal: [
    { cd_item_local: 1, ds_item_local: 'Quarto 101', sn_ativo: 'S' },
    { cd_item_local: 2, ds_item_local: 'Quarto 102', sn_ativo: 'S' },
    { cd_item_local: 3, ds_item_local: 'Sala de Cirurgia 1', sn_ativo: 'S' },
  ] as ItemLocal[],
  tiposLimpeza: [
    { cd_tipo_limpeza: 1, ds_tipo_limpeza: 'Limpeza Terminal', duracao_min: 60, sn_ativo: 'S' },
    { cd_tipo_limpeza: 2, ds_tipo_limpeza: 'Limpeza Concorrente', duracao_min: 30, sn_ativo: 'S' },
  ] as TipoLimpeza[],
  tiposOperador: [
    { cd_tipo_operador: 1, ds_tipo_operador: 'Auxiliar de Limpeza' },
    { cd_tipo_operador: 2, ds_tipo_operador: 'Técnico de Enfermagem' },
  ] as TipoOperador[],
  tiposAcesso: [
    { cd_tipo_acesso: 1, ds_tipo_acesso: 'Administrador' },
    { cd_tipo_acesso: 2, ds_tipo_acesso: 'Operador' },
    { cd_tipo_acesso: 3, ds_tipo_acesso: 'Visualizador' },
  ] as TipoAcesso[],
  statusErroQrcode: [
    { cd_status_erro_qrcode: 1, ds_status_erro_qrcode: 'QR Code Ilegível', cd_categoria_chamado: 1, sn_ativo: 'S' },
    { cd_status_erro_qrcode: 2, ds_status_erro_qrcode: 'QR Code Danificado', cd_categoria_chamado: 1, sn_ativo: 'S' },
  ] as StatusErroQrcode[],
  operadores: [
    { cd_operador: 1, nm_operador: 'Maria Silva', cd_usuario_sw: 'maria.silva', cod_empresa: 1, sn_ativo: 'S', sn_logado: 'N' },
    { cd_operador: 2, nm_operador: 'João Santos', cd_usuario_sw: 'joao.santos', cod_empresa: 1, sn_ativo: 'S', sn_logado: 'S' },
  ] as Operador[],

  // Categoria Chamado
  async getCategoriasChamado(): Promise<CategoriaChamado[]> {
    await delay(300);
    return [...this.categoriasChamado];
  },

  async createCategoriaChamado(data: Omit<CategoriaChamado, 'cd_categoria_chamado'>): Promise<CategoriaChamado> {
    await delay(300);
    const newItem: CategoriaChamado = {
      cd_categoria_chamado: this.categoriasChamado.length + 1,
      ...data,
    };
    this.categoriasChamado.push(newItem);
    return newItem;
  },

  async updateCategoriaChamado(id: number, data: Partial<CategoriaChamado>): Promise<CategoriaChamado> {
    await delay(300);
    const index = this.categoriasChamado.findIndex(item => item.cd_categoria_chamado === id);
    if (index === -1) throw new Error('Item não encontrado');
    
    this.categoriasChamado[index] = { ...this.categoriasChamado[index], ...data };
    return this.categoriasChamado[index];
  },

  async deleteCategoriaChamado(id: number): Promise<void> {
    await delay(300);
    const index = this.categoriasChamado.findIndex(item => item.cd_categoria_chamado === id);
    if (index === -1) throw new Error('Item não encontrado');
    this.categoriasChamado.splice(index, 1);
  },

  // Dispositivos
  async getDispositivos(): Promise<Dispositivo[]> {
    await delay(300);
    return [...this.dispositivos];
  },

  async createDispositivo(data: Omit<Dispositivo, 'cd_dispositivo'>): Promise<Dispositivo> {
    await delay(300);
    const newItem: Dispositivo = {
      cd_dispositivo: this.dispositivos.length + 1,
      ...data,
    };
    this.dispositivos.push(newItem);
    return newItem;
  },

  async updateDispositivo(id: number, data: Partial<Dispositivo>): Promise<Dispositivo> {
    await delay(300);
    const index = this.dispositivos.findIndex(item => item.cd_dispositivo === id);
    if (index === -1) throw new Error('Item não encontrado');
    
    this.dispositivos[index] = { ...this.dispositivos[index], ...data };
    return this.dispositivos[index];
  },

  async deleteDispositivo(id: number): Promise<void> {
    await delay(300);
    const index = this.dispositivos.findIndex(item => item.cd_dispositivo === id);
    if (index === -1) throw new Error('Item não encontrado');
    this.dispositivos.splice(index, 1);
  },

  // Continue with similar patterns for other entities...
  // For brevity, I'll implement the rest as simple stubs that work with empty arrays
  
  async getEtapas(): Promise<Etapa[]> {
    await delay(300);
    return [...this.etapas];
  },

  async createEtapa(data: Omit<Etapa, 'cd_etapa'>): Promise<Etapa> {
    await delay(300);
    const newItem: Etapa = { cd_etapa: this.etapas.length + 1, ...data };
    this.etapas.push(newItem);
    return newItem;
  },

  async updateEtapa(id: number, data: Partial<Etapa>): Promise<Etapa> {
    await delay(300);
    const index = this.etapas.findIndex(item => item.cd_etapa === id);
    if (index === -1) throw new Error('Item não encontrado');
    this.etapas[index] = { ...this.etapas[index], ...data };
    return this.etapas[index];
  },

  async deleteEtapa(id: number): Promise<void> {
    await delay(300);
    const index = this.etapas.findIndex(item => item.cd_etapa === id);
    if (index === -1) throw new Error('Item não encontrado');
    this.etapas.splice(index, 1);
  },

  // Itens Leito
  async getItensLeito(): Promise<ItemLeito[]> {
    await delay(300);
    return [...this.itensLeito];
  },

  async createItemLeito(data: Omit<ItemLeito, 'cd_item_leito'>): Promise<ItemLeito> {
    await delay(300);
    const newItem: ItemLeito = { cd_item_leito: this.itensLeito.length + 1, ...data };
    this.itensLeito.push(newItem);
    return newItem;
  },

  async updateItemLeito(id: number, data: Partial<ItemLeito>): Promise<ItemLeito> {
    await delay(300);
    const index = this.itensLeito.findIndex(item => item.cd_item_leito === id);
    if (index === -1) throw new Error('Item não encontrado');
    this.itensLeito[index] = { ...this.itensLeito[index], ...data };
    return this.itensLeito[index];
  },

  async deleteItemLeito(id: number): Promise<void> {
    await delay(300);
    const index = this.itensLeito.findIndex(item => item.cd_item_leito === id);
    if (index === -1) throw new Error('Item não encontrado');
    this.itensLeito.splice(index, 1);
  },

  // Itens Local
  async getItensLocal(): Promise<ItemLocal[]> {
    await delay(300);
    return [...this.itensLocal];
  },

  async createItemLocal(data: Omit<ItemLocal, 'cd_item_local'>): Promise<ItemLocal> {
    await delay(300);
    const newItem: ItemLocal = { cd_item_local: this.itensLocal.length + 1, ...data };
    this.itensLocal.push(newItem);
    return newItem;
  },

  async updateItemLocal(id: number, data: Partial<ItemLocal>): Promise<ItemLocal> {
    await delay(300);
    const index = this.itensLocal.findIndex(item => item.cd_item_local === id);
    if (index === -1) throw new Error('Item não encontrado');
    this.itensLocal[index] = { ...this.itensLocal[index], ...data };
    return this.itensLocal[index];
  },

  async deleteItemLocal(id: number): Promise<void> {
    await delay(300);
    const index = this.itensLocal.findIndex(item => item.cd_item_local === id);
    if (index === -1) throw new Error('Item não encontrado');
    this.itensLocal.splice(index, 1);
  },

  // Tipos Limpeza
  async getTiposLimpeza(): Promise<TipoLimpeza[]> {
    await delay(300);
    return [...this.tiposLimpeza];
  },

  async createTipoLimpeza(data: Omit<TipoLimpeza, 'cd_tipo_limpeza'>): Promise<TipoLimpeza> {
    await delay(300);
    const newItem: TipoLimpeza = { cd_tipo_limpeza: this.tiposLimpeza.length + 1, ...data };
    this.tiposLimpeza.push(newItem);
    return newItem;
  },

  async updateTipoLimpeza(id: number, data: Partial<TipoLimpeza>): Promise<TipoLimpeza> {
    await delay(300);
    const index = this.tiposLimpeza.findIndex(item => item.cd_tipo_limpeza === id);
    if (index === -1) throw new Error('Item não encontrado');
    this.tiposLimpeza[index] = { ...this.tiposLimpeza[index], ...data };
    return this.tiposLimpeza[index];
  },

  async deleteTipoLimpeza(id: number): Promise<void> {
    await delay(300);
    const index = this.tiposLimpeza.findIndex(item => item.cd_tipo_limpeza === id);
    if (index === -1) throw new Error('Item não encontrado');
    this.tiposLimpeza.splice(index, 1);
  },

  // Tipos Operador
  async getTiposOperador(): Promise<TipoOperador[]> {
    await delay(300);
    return [...this.tiposOperador];
  },

  async createTipoOperador(data: Omit<TipoOperador, 'cd_tipo_operador'>): Promise<TipoOperador> {
    await delay(300);
    const newItem: TipoOperador = { cd_tipo_operador: this.tiposOperador.length + 1, ...data };
    this.tiposOperador.push(newItem);
    return newItem;
  },

  async updateTipoOperador(id: number, data: Partial<TipoOperador>): Promise<TipoOperador> {
    await delay(300);
    const index = this.tiposOperador.findIndex(item => item.cd_tipo_operador === id);
    if (index === -1) throw new Error('Item não encontrado');
    this.tiposOperador[index] = { ...this.tiposOperador[index], ...data };
    return this.tiposOperador[index];
  },

  async deleteTipoOperador(id: number): Promise<void> {
    await delay(300);
    const index = this.tiposOperador.findIndex(item => item.cd_tipo_operador === id);
    if (index === -1) throw new Error('Item não encontrado');
    this.tiposOperador.splice(index, 1);
  },

  // Tipos Acesso
  async getTiposAcesso(): Promise<TipoAcesso[]> {
    await delay(300);
    return [...this.tiposAcesso];
  },

  async createTipoAcesso(data: Omit<TipoAcesso, 'cd_tipo_acesso'>): Promise<TipoAcesso> {
    await delay(300);
    const newItem: TipoAcesso = { cd_tipo_acesso: this.tiposAcesso.length + 1, ...data };
    this.tiposAcesso.push(newItem);
    return newItem;
  },

  async updateTipoAcesso(id: number, data: Partial<TipoAcesso>): Promise<TipoAcesso> {
    await delay(300);
    const index = this.tiposAcesso.findIndex(item => item.cd_tipo_acesso === id);
    if (index === -1) throw new Error('Item não encontrado');
    this.tiposAcesso[index] = { ...this.tiposAcesso[index], ...data };
    return this.tiposAcesso[index];
  },

  async deleteTipoAcesso(id: number): Promise<void> {
    await delay(300);
    const index = this.tiposAcesso.findIndex(item => item.cd_tipo_acesso === id);
    if (index === -1) throw new Error('Item não encontrado');
    this.tiposAcesso.splice(index, 1);
  },

  // Status Erro QRCode
  async getStatusErroQrcode(): Promise<StatusErroQrcode[]> {
    await delay(300);
    return [...this.statusErroQrcode];
  },

  async createStatusErroQrcode(data: Omit<StatusErroQrcode, 'cd_status_erro_qrcode'>): Promise<StatusErroQrcode> {
    await delay(300);
    const newItem: StatusErroQrcode = { cd_status_erro_qrcode: this.statusErroQrcode.length + 1, ...data };
    this.statusErroQrcode.push(newItem);
    return newItem;
  },

  async updateStatusErroQrcode(id: number, data: Partial<StatusErroQrcode>): Promise<StatusErroQrcode> {
    await delay(300);
    const index = this.statusErroQrcode.findIndex(item => item.cd_status_erro_qrcode === id);
    if (index === -1) throw new Error('Item não encontrado');
    this.statusErroQrcode[index] = { ...this.statusErroQrcode[index], ...data };
    return this.statusErroQrcode[index];
  },

  async deleteStatusErroQrcode(id: number): Promise<void> {
    await delay(300);
    const index = this.statusErroQrcode.findIndex(item => item.cd_status_erro_qrcode === id);
    if (index === -1) throw new Error('Item não encontrado');
    this.statusErroQrcode.splice(index, 1);
  },

  // Operadores
  async getOperadores(): Promise<Operador[]> {
    await delay(300);
    return [...this.operadores];
  },

  async createOperador(data: Omit<Operador, 'cd_operador'>): Promise<Operador> {
    await delay(300);
    const newItem: Operador = { cd_operador: this.operadores.length + 1, ...data };
    this.operadores.push(newItem);
    return newItem;
  },

  async updateOperador(id: number, data: Partial<Operador>): Promise<Operador> {
    await delay(300);
    const index = this.operadores.findIndex(item => item.cd_operador === id);
    if (index === -1) throw new Error('Item não encontrado');
    this.operadores[index] = { ...this.operadores[index], ...data };
    return this.operadores[index];
  },

  async deleteOperador(id: number): Promise<void> {
    await delay(300);
    const index = this.operadores.findIndex(item => item.cd_operador === id);
    if (index === -1) throw new Error('Item não encontrado');
    this.operadores.splice(index, 1);
  },
};
