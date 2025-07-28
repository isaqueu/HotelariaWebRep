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
import { itemLeitoService } from '../services/itemLeitoService';
import { itemLocalService } from '../services/itemLocalService';
import type { ItemLeito, ItemLocal } from '../types';

export function ItemLeitoPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemLeito | null>(null);
  const [itensLeito, setItensLeito] = useState<ItemLeito[]>([]);
  const [itensLocal, setItensLocal] = useState<ItemLocal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<Omit<ItemLeito, 'cd_item_leito'>>({
    defaultValues: {
      ds_item_leito: '',
      cd_item_local: 0,
      sn_ativo: 'S',
      sn_item_coletivo_enfermaria: 'N',
      sn_item_checklist: 'N',
    },
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [itensLeitoData, itensLocalData] = await Promise.all([
        itemLeitoService.getAll(),
        itemLocalService.getAll(),
      ]);
      setItensLeito(Array.isArray(itensLeitoData) ? itensLeitoData : []);
      setItensLocal(Array.isArray(itensLocalData) ? itensLocalData : []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({ title: 'Erro ao carregar dados', variant: 'destructive' });
      setItensLeito([]);
      setItensLocal([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (data: Omit<ItemLeito, 'cd_item_leito'>) => {
    try {
      if (editingItem) {
        await itemLeitoService.update(editingItem.cd_item_leito, data);
        toast({ title: 'Item do leito atualizado com sucesso!' });
      } else {
        await itemLeitoService.create(data);
        toast({ title: 'Item do leito criado com sucesso!' });
      }
      setIsCreateModalOpen(false);
      setEditingItem(null);
      form.reset();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar item do leito:', error);
      toast({ title: 'Erro ao salvar item do leito', variant: 'destructive' });
    }
  };

  const handleEdit = (item: ItemLeito) => {
    setEditingItem(item);
    form.reset(item);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este item do leito?')) {
      try {
        await itemLeitoService.delete(id);
        toast({ title: 'Item do leito excluído com sucesso!' });
        loadData();
      } catch (error) {
        console.error('Erro ao excluir item do leito:', error);
        toast({ title: 'Erro ao excluir item do leito', variant: 'destructive' });
      }
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    form.reset();
    setIsCreateModalOpen(true);
  };

  const filteredItens = (Array.isArray(itensLeito) && itensLeito.length > 0) ? itensLeito.filter(item =>
    item?.ds_item_leito?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const getItemLocalName = (id: number) => {
    const item = itensLocal.find(i => i.cd_item_local === id);
    return item?.ds_item_local || 'Não informado';
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
          <p className="text-gray-600">Gerencie os itens associados aos leitos hospitalares</p>
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
                          value={field.value.toString()} 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o item local" />
                          </SelectTrigger>
                          <SelectContent>
                            {itensLocal.map((item) => (
                              <SelectItem key={item.cd_item_local} value={item.cd_item_local.toString()}>
                                {item.ds_item_local}
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
                  name="sn_item_coletivo_enfermaria"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value === 'S'}
                          onCheckedChange={(checked) => field.onChange(checked ? 'S' : 'N')}
                        />
                      </FormControl>
                      <Label>Item Coletivo Enfermaria</Label>
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
                      <Label>Item Checklist</Label>
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
      <MaterialCard className="p-6 bg-gradient-to-r from-blue-50 to-blue-100/50 border-2 border-blue-200 shadow-sm">
          <FloatingLabelInput
            label="Buscar item do leito..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-5 w-5" />}
          />
      </MaterialCard>

      {/* Data Table */}
      <MaterialCard className="overflow-hidden border-2 border-blue-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b-2 border-blue-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider border-r border-blue-200/40">
                  Código
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider border-r border-blue-200/40">
                  Descrição
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider border-r border-blue-200/40">
                  Item Local
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-200/40">
              {filteredItens.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 border-b border-blue-200/20">
                    Nenhum item do leito encontrado
                  </td>
                </tr>
              ) : (
                filteredItens.map((item) => (
                  <tr key={item.cd_item_leito} className="hover:bg-blue-50/30 border-b border-blue-200/20">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-blue-200/20">
                      {item.cd_item_leito}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-blue-200/20">
                      {item.ds_item_leito}
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-blue-200/20">
                      {getItemLocalName(item.cd_item_local)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <MaterialButton
                        variant="outline"
                        size="sm"
                        elevated={false}
                        onClick={() => handleEdit(item)}
                        className="p-2 border border-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </MaterialButton>
                      <MaterialButton
                        variant="destructive"
                        size="sm"
                        elevated={false}
                        onClick={() => handleDelete(item.cd_item_leito)}
                        className="p-2 border border-red-300"
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