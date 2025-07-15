import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { MaterialCard } from '../components/ui/material-card';
import { MaterialButton } from '../components/ui/material-button';
import { FloatingLabelInput } from '../components/ui/floating-label-input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { queryClient } from '@/lib/queryClient';
import { tipoLimpezaApi } from '../services/api';
import { mockDataService } from '../services/mockService';
import { useMock } from '../contexts/MockContext';
import type { TipoLimpeza } from '../types';

export function TipoLimpezaPage() {
  const { useMock: mockMode } = useMock();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TipoLimpeza | null>(null);

  const form = useForm<Omit<TipoLimpeza, 'cd_tipo_limpeza'>>({
    defaultValues: {
      ds_tipo_limpeza: '',
      duracao_min: 30,
      sn_ativo: 'S',
    },
  });

  // Queries
  const { data: tiposLimpeza = [], isLoading } = useQuery({
    queryKey: ['/api/tipo-limpeza'],
    queryFn: () => mockMode ? mockDataService.getTiposLimpeza() : tipoLimpezaApi.getAll(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: Omit<TipoLimpeza, 'cd_tipo_limpeza'>) =>
      mockMode ? mockDataService.createTipoLimpeza(data) : tipoLimpezaApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tipo-limpeza'] });
      toast({ title: 'Tipo de limpeza criado com sucesso!' });
      setIsCreateModalOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Erro ao criar tipo de limpeza', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TipoLimpeza> }) =>
      mockMode ? mockDataService.updateTipoLimpeza(id, data) : tipoLimpezaApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tipo-limpeza'] });
      toast({ title: 'Tipo de limpeza atualizado com sucesso!' });
      setEditingItem(null);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar tipo de limpeza', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      mockMode ? mockDataService.deleteTipoLimpeza(id) : tipoLimpezaApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tipo-limpeza'] });
      toast({ title: 'Tipo de limpeza excluído com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro ao excluir tipo de limpeza', variant: 'destructive' });
    },
  });

  // Filtered data
  const filteredTipos = tiposLimpeza.filter(tipo =>
    tipo.ds_tipo_limpeza.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (data: Omit<TipoLimpeza, 'cd_tipo_limpeza'>) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.cd_tipo_limpeza, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (tipo: TipoLimpeza) => {
    setEditingItem(tipo);
    form.reset(tipo);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este tipo de limpeza?')) {
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
          <h1 className="text-3xl font-medium text-gray-800 mb-2">Tipos de Limpeza</h1>
          <p className="text-gray-600">Gerencie os tipos de limpeza disponíveis no sistema</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <MaterialButton onClick={openCreateModal} className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Novo Tipo
            </MaterialButton>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Tipo de Limpeza' : 'Novo Tipo de Limpeza'}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="ds_tipo_limpeza"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          label="Descrição do Tipo de Limpeza"
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
                  name="duracao_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          label="Duração (em minutos)"
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          required
                        />
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
          label="Buscar tipo de limpeza..."
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
                  Duração (min)
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
              {filteredTipos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nenhum tipo de limpeza encontrado
                  </td>
                </tr>
              ) : (
                filteredTipos.map((tipo) => (
                  <tr key={tipo.cd_tipo_limpeza} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {tipo.cd_tipo_limpeza}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tipo.ds_tipo_limpeza}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tipo.duracao_min}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={tipo.sn_ativo === 'S' ? 'default' : 'secondary'}>
                        {tipo.sn_ativo === 'S' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <MaterialButton
                        variant="outline"
                        size="sm"
                        elevated={false}
                        onClick={() => handleEdit(tipo)}
                        className="p-2"
                      >
                        <Edit className="h-4 w-4" />
                      </MaterialButton>
                      <MaterialButton
                        variant="destructive"
                        size="sm"
                        elevated={false}
                        onClick={() => handleDelete(tipo.cd_tipo_limpeza)}
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
