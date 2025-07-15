import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
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
import { queryClient } from '@/lib/queryClient';
import { etapaApi, categoriaChamadoApi, tipoOperadorApi } from '../services/api';
import type { Etapa } from '../types';

export function EtapaPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Etapa | null>(null);

  const form = useForm<Omit<Etapa, 'cd_etapa'>>({
    defaultValues: {
      ds_etapa: '',
      ordem: 1,
      cd_categoria_chamado: undefined,
      cd_tipo_operador: undefined,
      sn_ativo: 'S',
      sn_le_qrcode: 'N',
    },
  });

  // Queries
  const { data: etapas = [], isLoading } = useQuery({
    queryKey: ['/api/etapa'],
    queryFn: () => etapaApi.getAll(),
  });

  const { data: categorias = [] } = useQuery({
    queryKey: ['/api/categoria-chamado'],
    queryFn: () => categoriaChamadoApi.getAll(),
  });

  const { data: tiposOperador = [] } = useQuery({
    queryKey: ['/api/tipo-operador'],
    queryFn: () => tipoOperadorApi.getAll(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: Omit<Etapa, 'cd_etapa'>) =>
      etapaApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/etapa'] });
      toast({ title: 'Etapa criada com sucesso!' });
      setIsCreateModalOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Erro ao criar etapa', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Etapa> }) =>
      etapaApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/etapa'] });
      toast({ title: 'Etapa atualizada com sucesso!' });
      setEditingItem(null);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar etapa', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      etapaApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/etapa'] });
      toast({ title: 'Etapa excluída com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro ao excluir etapa', variant: 'destructive' });
    },
  });

  // Filtered data
  const filteredEtapas = etapas.filter(etapa =>
    etapa.ds_etapa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (data: Omit<Etapa, 'cd_etapa'>) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.cd_etapa, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (etapa: Etapa) => {
    setEditingItem(etapa);
    form.reset(etapa);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta etapa?')) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    form.reset();
    setIsCreateModalOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium text-gray-800 mb-2">Etapas</h1>
          <p className="text-gray-600">Gerencie as etapas do fluxo de serviços</p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <MaterialButton onClick={openCreateModal} className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Nova Etapa
            </MaterialButton>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Etapa' : 'Nova Etapa'}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            label="Ordem de Execução"
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
                            value={field.value && field.value > 0 ? field.value.toString() : ""}
                            onValueChange={(value) => field.onChange(parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Categoria do Chamado" />
                            </SelectTrigger>
                            <SelectContent>
                              {categorias.map((categoria) => (
                                <SelectItem
                                  key={categoria.cd_categoria_chamado}
                                  value={categoria.cd_categoria_chamado.toString()}
                                >
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
                            value={field.value && field.value > 0 ? field.value.toString() : ""}
                            onValueChange={(value) => field.onChange(parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo de Operador" />
                            </SelectTrigger>
                            <SelectContent>
                              {tiposOperador.map((tipo) => (
                                <SelectItem
                                  key={tipo.cd_tipo_operador}
                                  value={tipo.cd_tipo_operador.toString()}
                                >
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
                </div>

                <div className="flex items-center space-x-6">
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
                        <Label>Leitura de QRCode Obrigatória</Label>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <MaterialButton
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancelar
                  </MaterialButton>
                  <MaterialButton
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? 'Salvando...'
                      : editingItem
                      ? 'Atualizar'
                      : 'Criar'
                    }
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
                  Ordem
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  QRCode
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
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma etapa encontrada
                  </td>
                </tr>
              ) : (
                filteredEtapas.map((etapa) => (
                  <tr key={etapa.cd_etapa} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {etapa.ordem}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {etapa.ds_etapa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={etapa.sn_le_qrcode === 'S' ? 'default' : 'secondary'}>
                        {etapa.sn_le_qrcode === 'S' ? 'Obrigatório' : 'Opcional'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={etapa.sn_ativo === 'S' ? 'default' : 'secondary'}>
                        {etapa.sn_ativo === 'S' ? 'Ativo' : 'Inativo'}
                      </Badge>
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