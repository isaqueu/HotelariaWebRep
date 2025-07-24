
import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { MaterialCard } from '../components/ui/material-card';
import { MaterialButton } from '../components/ui/material-button';
import { FloatingLabelInput } from '../components/ui/floating-label-input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { etapaService } from '../services/etapaService';
import { categoriaChamadoService } from '../services/categoriaChamadoService';
import { tipoOperadorService } from '../services/tipoOperadorService';
import type { Etapa, CategoriaChamado, TipoOperador } from '../types';

export function EtapaPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Etapa | null>(null);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [categorias, setCategorias] = useState<CategoriaChamado[]>([]);
  const [tiposOperador, setTiposOperador] = useState<TipoOperador[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<Omit<Etapa, 'cd_etapa'>>({
    defaultValues: {
      ds_etapa: '',
      ordem: 1,
      cd_categoria_chamado: 0,
      cd_tipo_operador: 0,
      sn_ativo: 'S',
      sn_le_qrcode: 'N',
    },
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [etapasData, categoriasData, tiposOperadorData] = await Promise.all([
        etapaService.getAll(),
        categoriaChamadoService.getAll(),
        tipoOperadorService.getAll(),
      ]);
      setEtapas(Array.isArray(etapasData) ? etapasData : []);
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
      setTiposOperador(Array.isArray(tiposOperadorData) ? tiposOperadorData : []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({ title: 'Erro ao carregar dados', variant: 'destructive' });
      setEtapas([]);
      setCategorias([]);
      setTiposOperador([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (data: Omit<Etapa, 'cd_etapa'>) => {
    try {
      if (editingItem) {
        await etapaService.update(editingItem.cd_etapa, data);
        toast({ title: 'Etapa atualizada com sucesso!' });
      } else {
        await etapaService.create(data);
        toast({ title: 'Etapa criada com sucesso!' });
      }
      setIsCreateModalOpen(false);
      setEditingItem(null);
      form.reset();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar etapa:', error);
      toast({ title: 'Erro ao salvar etapa', variant: 'destructive' });
    }
  };

  const handleEdit = (etapa: Etapa) => {
    setEditingItem(etapa);
    form.reset(etapa);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta etapa?')) {
      try {
        await etapaService.delete(id);
        toast({ title: 'Etapa excluída com sucesso!' });
        loadData();
      } catch (error) {
        console.error('Erro ao excluir etapa:', error);
        toast({ title: 'Erro ao excluir etapa', variant: 'destructive' });
      }
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    form.reset();
    setIsCreateModalOpen(true);
  };

  const filteredEtapas = (Array.isArray(etapas) && etapas.length > 0) ? etapas.filter(etapa =>
    etapa?.ds_etapa?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const getCategoriaName = (id: number) => {
    const categoria = categorias.find(c => c.cd_categoria_chamado === id);
    return categoria?.ds_categoria_chamado || 'Não informado';
  };

  const getTipoOperadorName = (id: number) => {
    const tipo = tiposOperador.find(t => t.cd_tipo_operador === id);
    return tipo?.ds_tipo_operador || 'Não informado';
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium text-gray-800 mb-2">Etapas de Processo</h1>
          <p className="text-gray-600">Gerencie as etapas dos processos disponíveis no sistema</p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <MaterialButton onClick={openCreateModal} className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Nova Etapa
            </MaterialButton>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Etapa' : 'Nova Etapa'}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="ds_etapa"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          label="Descrição da Etapa"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ordem"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          label="Ordem"
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cd_categoria_chamado"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select 
                          value={field.value.toString()} 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categorias.map((categoria) => (
                              <SelectItem key={categoria.cd_categoria_chamado} value={categoria.cd_categoria_chamado.toString()}>
                                {categoria.ds_categoria_chamado}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cd_tipo_operador"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select 
                          value={field.value.toString()} 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de operador" />
                          </SelectTrigger>
                          <SelectContent>
                            {tiposOperador.map((tipo) => (
                              <SelectItem key={tipo.cd_tipo_operador} value={tipo.cd_tipo_operador.toString()}>
                                {tipo.ds_tipo_operador}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sn_ativo"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value === 'S'}
                          onCheckedChange={(checked) => field.onChange(checked ? 'S' : 'N')}
                        />
                      </FormControl>
                      <Label>Ativo</Label>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sn_le_qrcode"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value === 'S'}
                          onCheckedChange={(checked) => field.onChange(checked ? 'S' : 'N')}
                        />
                      </FormControl>
                      <Label>Lê QRCode</Label>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <MaterialButton
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancelar
                  </MaterialButton>
                  <MaterialButton type="submit">
                    {editingItem ? 'Atualizar' : 'Criar'}
                  </MaterialButton>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <MaterialCard className="p-6">
        <FloatingLabelInput
          label="Buscar etapa..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="h-5 w-5" />}
        />
      </MaterialCard>

      {/* Data Table */}
      <MaterialCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ordem
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo Operador
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEtapas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma etapa encontrada
                  </td>
                </tr>
              ) : (
                filteredEtapas.map((etapa) => (
                  <tr key={etapa.cd_etapa} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {etapa.cd_etapa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {etapa.ds_etapa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {etapa.ordem}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCategoriaName(etapa.cd_categoria_chamado)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getTipoOperadorName(etapa.cd_tipo_operador)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <Badge variant={etapa.sn_ativo === 'S' ? 'default' : 'secondary'}>
                          {etapa.sn_ativo === 'S' ? 'Ativo' : 'Inativo'}
                        </Badge>
                        <Badge variant={etapa.sn_le_qrcode === 'S' ? 'default' : 'secondary'}>
                          {etapa.sn_le_qrcode === 'S' ? 'Lê QRCode' : 'Não lê QRCode'}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <MaterialButton
                        variant="outline"
                        size="sm"
                        elevated={false}
                        onClick={() => handleEdit(etapa)}
                        className="p-2"
                      >
                        <Edit className="h-4 w-4" />
                      </MaterialButton>
                      <MaterialButton
                        variant="destructive"
                        size="sm"
                        elevated={false}
                        onClick={() => handleDelete(etapa.cd_etapa)}
                        className="p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </MaterialButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </MaterialCard>
    </div>
  );
}
