
import { useState, useEffect } from 'react';
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
import { tipoLimpezaService } from '../services/tipoLimpezaService';
import type { TipoLimpeza } from '../types';

export function TipoLimpezaPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TipoLimpeza | null>(null);
  const [tiposLimpeza, setTiposLimpeza] = useState<TipoLimpeza[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<Omit<TipoLimpeza, 'cd_tipo_limpeza'>>({
    defaultValues: {
      ds_tipo_limpeza: '',
      duracao_min: 30,
      sn_ativo: 'S',
    },
  });

  const loadTiposLimpeza = async () => {
    try {
      setIsLoading(true);
      const data = await tipoLimpezaService.getAll();
      setTiposLimpeza(Array.isArray(data) && data.length >= 0 ? data : []);
    } catch (error) {
      console.error('Erro ao carregar tipos de limpeza:', error);
      toast({ title: 'Erro ao carregar tipos de limpeza', variant: 'destructive' });
      setTiposLimpeza([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTiposLimpeza();
  }, []);

  const handleSubmit = async (data: Omit<TipoLimpeza, 'cd_tipo_limpeza'>) => {
    try {
      if (editingItem) {
        await tipoLimpezaService.update(editingItem.cd_tipo_limpeza, data);
        toast({ title: 'Tipo de limpeza atualizado com sucesso!' });
      } else {
        await tipoLimpezaService.create(data);
        toast({ title: 'Tipo de limpeza criado com sucesso!' });
      }
      setIsCreateModalOpen(false);
      setEditingItem(null);
      form.reset();
      loadTiposLimpeza();
    } catch (error) {
      console.error('Erro ao salvar tipo de limpeza:', error);
      toast({ title: 'Erro ao salvar tipo de limpeza', variant: 'destructive' });
    }
  };

  const handleEdit = (tipo: TipoLimpeza) => {
    setEditingItem(tipo);
    form.reset(tipo);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este tipo de limpeza?')) {
      try {
        await tipoLimpezaService.delete(id);
        toast({ title: 'Tipo de limpeza excluído com sucesso!' });
        loadTiposLimpeza();
      } catch (error) {
        console.error('Erro ao excluir tipo de limpeza:', error);
        toast({ title: 'Erro ao excluir tipo de limpeza', variant: 'destructive' });
      }
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    form.reset();
    setIsCreateModalOpen(true);
  };

  // Filtered data
  const filteredTipos = (Array.isArray(tiposLimpeza) && tiposLimpeza.length > 0) ? tiposLimpeza.filter(tipo =>
    tipo?.ds_tipo_limpeza?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

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
