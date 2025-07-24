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

  const filteredItens = Array.isArray(itensLeito) ? itensLeito.filter(item =>
    item.ds_item_leito.toLowerCase().includes(searchQuery.toLowerCase())
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Itens do Leito</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <MaterialButton onClick={openCreateModal} className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Item do Leito
            </MaterialButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
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
                          label="Descrição"
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
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value === 'S'}
                          onCheckedChange={(checked) => field.onChange(checked ? 'S' : 'N')}
                        />
                        <Label>Ativo</Label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sn_item_coletivo_enfermaria"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value === 'S'}
                          onCheckedChange={(checked) => field.onChange(checked ? 'S' : 'N')}
                        />
                        <Label>Item Coletivo Enfermaria</Label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sn_item_checklist"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value === 'S'}
                          onCheckedChange={(checked) => field.onChange(checked ? 'S' : 'N')}
                        />
                        <Label>Item Checklist</Label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 pt-4">
                  <MaterialButton type="submit" className="flex-1">
                    {editingItem ? 'Atualizar' : 'Criar'}
                  </MaterialButton>
                  <MaterialButton 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </MaterialButton>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <FloatingLabelInput
            label="Pesquisar itens do leito..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredItens.map((item) => (
          <MaterialCard key={item.cd_item_leito} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{item.ds_item_leito}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Item Local: {getItemLocalName(item.cd_item_local)}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant={item.sn_ativo === 'S' ? 'default' : 'secondary'}>
                    {item.sn_ativo === 'S' ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <Badge variant={item.sn_item_coletivo_enfermaria === 'S' ? 'default' : 'secondary'}>
                    {item.sn_item_coletivo_enfermaria === 'S' ? 'Coletivo Enfermaria' : 'Individual'}
                  </Badge>
                  <Badge variant={item.sn_item_checklist === 'S' ? 'default' : 'secondary'}>
                    {item.sn_item_checklist === 'S' ? 'Item Checklist' : 'Não é Checklist'}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <MaterialButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                >
                  <Edit className="w-4 h-4" />
                </MaterialButton>
                <MaterialButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(item.cd_item_leito)}
                >
                  <Trash2 className="w-4 h-4" />
                </MaterialButton>
              </div>
            </div>
          </MaterialCard>
        ))}
      </div>
    </div>
  );
}