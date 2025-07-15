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
import { itemLeitoApi, itemLocalApi } from '../services/api';
import { mockDataService } from '../services/mockService';
import { useMock } from '../contexts/MockContext';
import type { ItemLeito } from '../types';

export function ItemLeitoPage() {
  const { useMock: mockMode } = useMock();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemLeito | null>(null);

  const form = useForm<Omit<ItemLeito, 'cd_item_leito'>>({
    defaultValues: {
      ds_item_leito: '',
      cd_item_local: undefined,
      sn_ativo: 'S',
      sn_item_coletivo_enfermaria: 'N',
      sn_item_checklist: 'N',
    },
  });

  // Queries
  const { data: itensLeito = [], isLoading } = useQuery({
    queryKey: ['/api/item-leito'],
    queryFn: () => mockMode ? mockDataService.getItensLeito() : itemLeitoApi.getAll(),
  });

  const { data: locais = [] } = useQuery({
    queryKey: ['/api/item-local'],
    queryFn: () => mockMode ? mockDataService.getItensLocal() : itemLocalApi.getAll(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: Omit<ItemLeito, 'cd_item_leito'>) =>
      mockMode ? mockDataService.createItemLeito(data) : itemLeitoApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/item-leito'] });
      toast({ title: 'Item do leito criado com sucesso!' });
      setIsCreateModalOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Erro ao criar item do leito', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ItemLeito> }) =>
      mockMode ? mockDataService.updateItemLeito(id, data) : itemLeitoApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/item-leito'] });
      toast({ title: 'Item do leito atualizado com sucesso!' });
      setEditingItem(null);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar item do leito', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      mockMode ? mockDataService.deleteItemLeito(id) : itemLeitoApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/item-leito'] });
      toast({ title: 'Item do leito excluído com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro ao excluir item do leito', variant: 'destructive' });
    },
  });

  // Filtered data
  const filteredItens = itensLeito.filter(item =>
    item.ds_item_leito.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (data: Omit<ItemLeito, 'cd_item_leito'>) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.cd_item_leito, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item: ItemLeito) => {
    setEditingItem(item);
    form.reset(item);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este item do leito?')) {
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
          <h1 className="text-3xl font-medium text-gray-800 mb-2">Itens do Leito</h1>
          <p className="text-gray-600">Gerencie os itens que devem ser verificados no leito</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <MaterialButton onClick={openCreateModal} className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Novo Item
            </MaterialButton>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Item do Leito' : 'Novo Item do Leito'}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="ds_item_leito"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          label="Descrição do Item"
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
                  name="cd_item_local"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value && field.value > 0 ? field.value.toString() : ""}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Local do Item" />
                          </SelectTrigger>
                          <SelectContent>
                            {locais.map((local) => (
                              <SelectItem
                                key={local.cd_item_local}
                                value={local.cd_item_local.toString()}
                              >
                                {local.ds_item_local}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
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
                    name="sn_item_coletivo_enfermaria"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value === 'S'}
                            onCheckedChange={(checked) => field.onChange(checked ? 'S' : 'N')}
                          />
                        </FormControl>
                        <Label>Item Coletivo da Enfermaria</Label>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sn_item_checklist"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value === 'S'}
                            onCheckedChange={(checked) => field.onChange(checked ? 'S' : 'N')}
                          />
                        </FormControl>
                        <Label>Parte do Checklist da Camareira</Label>
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
          label="Buscar item..."
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
                  Descrição
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coletivo
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Checklist
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
              {filteredItens.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nenhum item encontrado
                  </td>
                </tr>
              ) : (
                filteredItens.map((item) => (
                  <tr key={item.cd_item_leito} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.ds_item_leito}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={item.sn_item_coletivo_enfermaria === 'S' ? 'default' : 'secondary'}>
                        {item.sn_item_coletivo_enfermaria === 'S' ? 'Sim' : 'Não'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={item.sn_item_checklist === 'S' ? 'default' : 'secondary'}>
                        {item.sn_item_checklist === 'S' ? 'Sim' : 'Não'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={item.sn_ativo === 'S' ? 'default' : 'secondary'}>
                        {item.sn_ativo === 'S' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <MaterialButton
                        variant="outline"
                        size="sm"
                        elevated={false}
                        onClick={() => handleEdit(item)}
                        className="p-2"
                      >
                        <Edit className="h-4 w-4" />
                      </MaterialButton>
                      <MaterialButton
                        variant="destructive"
                        size="sm"
                        elevated={false}
                        onClick={() => handleDelete(item.cd_item_leito)}
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
