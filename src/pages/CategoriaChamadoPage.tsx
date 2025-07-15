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
import { categoriaChamadoApi } from '../services/api';
import type { CategoriaChamado } from '../types';

export function CategoriaChamadoPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoriaChamado | null>(null);

  const form = useForm<Omit<CategoriaChamado, 'cd_categoria_chamado'>>({
    defaultValues: {
      ds_categoria_chamado: '',
      sn_ativo: 'S',
    },
  });

  // Queries
  const { data: categorias = [], isLoading } = useQuery({
    queryKey: ['/api/categoria-chamado'],
    queryFn: () => categoriaChamadoApi.getAll(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: Omit<CategoriaChamado, 'cd_categoria_chamado'>) =>
      categoriaChamadoApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categoria-chamado'] });
      toast({ title: 'Categoria criada com sucesso!' });
      setIsCreateModalOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Erro ao criar categoria', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CategoriaChamado> }) =>
      categoriaChamadoApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categoria-chamado'] });
      toast({ title: 'Categoria atualizada com sucesso!' });
      setEditingItem(null);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar categoria', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      categoriaChamadoApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categoria-chamado'] });
      toast({ title: 'Categoria excluída com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro ao excluir categoria', variant: 'destructive' });
    },
  });

  // Filtered data
  const filteredCategorias = categorias.filter(categoria => {
    const matchesSearch = categoria.ds_categoria_chamado.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || statusFilter === '' || categoria.sn_ativo === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (data: Omit<CategoriaChamado, 'cd_categoria_chamado'>) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.cd_categoria_chamado, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (categoria: CategoriaChamado) => {
    setEditingItem(categoria);
    form.reset({
      ds_categoria_chamado: categoria.ds_categoria_chamado,
      sn_ativo: categoria.sn_ativo,
    });
    setIsCreateModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
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
          <h1 className="text-3xl font-medium text-gray-800 mb-2">Categoria de Chamados</h1>
          <p className="text-gray-600">Gerencie as categorias de chamados do sistema</p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <MaterialButton onClick={openCreateModal} className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Nova Categoria
            </MaterialButton>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="ds_categoria_chamado"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          label="Descrição da Categoria"
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
                      <FormMessage />
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

      {/* Filters and Search */}
      <MaterialCard className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <FloatingLabelInput
              label="Buscar categoria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-5 w-5" />}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todos os Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="S">Ativo</SelectItem>
                <SelectItem value="N">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </MaterialCard>

      {/* Data Table */}
      <MaterialCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header-highlight border-b border-primary-blue/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs table-header-text uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-4 text-left text-xs table-header-text uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-4 text-left text-xs table-header-text uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs table-header-text uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategorias.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma categoria encontrada
                  </td>
                </tr>
              ) : (
                filteredCategorias.map((categoria) => (
                  <tr key={categoria.cd_categoria_chamado} className="table-hover">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {categoria.cd_categoria_chamado}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {categoria.ds_categoria_chamado}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={categoria.sn_ativo === 'S' ? 'default' : 'secondary'}>
                        {categoria.sn_ativo === 'S' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <MaterialButton
                        variant="outline"
                        size="sm"
                        elevated={false}
                        onClick={() => handleEdit(categoria)}
                        className="p-2"
                      >
                        <Edit className="h-4 w-4" />
                      </MaterialButton>
                      <MaterialButton
                        variant="destructive"
                        size="sm"
                        elevated={false}
                        onClick={() => handleDelete(categoria.cd_categoria_chamado)}
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