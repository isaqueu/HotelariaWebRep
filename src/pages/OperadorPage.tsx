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
import { operadorApi } from '../services/api';
import type { Operador } from '../types';

export function OperadorPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Operador | null>(null);

  const form = useForm<Omit<Operador, 'cd_operador'>>({
    defaultValues: {
      nm_operador: '',
      cd_usuario_sw: '',
      cod_empresa: 1,
      sn_ativo: 'S',
      sn_logado: 'N',
    },
  });

  // Queries
  const { data: operadores = [], isLoading } = useQuery({
    queryKey: ['/api/operador'],
    queryFn: () => operadorApi.getAll(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: Omit<Operador, 'cd_operador'>) =>
      operadorApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/operador'] });
      toast({ title: 'Operador criado com sucesso!' });
      setIsCreateModalOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Erro ao criar operador', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Operador> }) =>
      operadorApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/operador'] });
      toast({ title: 'Operador atualizado com sucesso!' });
      setEditingItem(null);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar operador', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      operadorApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/operador'] });
      toast({ title: 'Operador excluído com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro ao excluir operador', variant: 'destructive' });
    },
  });

  // Filtered data
  const filteredOperadores = operadores.filter(operador =>
    operador.nm_operador.toLowerCase().includes(searchQuery.toLowerCase()) ||
    operador.cd_usuario_sw.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (data: Omit<Operador, 'cd_operador'>) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.cd_operador, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (operador: Operador) => {
    setEditingItem(operador);
    form.reset(operador);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este operador?')) {
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
          <h1 className="text-3xl font-medium text-gray-800 mb-2">Operadores</h1>
          <p className="text-gray-600">Gerencie os operadores que lidam com as etapas dos chamados</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <MaterialButton onClick={openCreateModal} className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Novo Operador
            </MaterialButton>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Operador' : 'Novo Operador'}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nm_operador"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          label="Nome do Operador"
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
                  name="cd_usuario_sw"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          label="Código do Usuário SW"
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
                  name="cod_empresa"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          label="Código da Empresa"
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
                    name="sn_logado"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value === 'S'}
                            onCheckedChange={(checked) => field.onChange(checked ? 'S' : 'N')}
                          />
                        </FormControl>
                        <Label>Está Logado</Label>
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
          label="Buscar operador..."
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
                  Nome
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário SW
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Logado
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOperadores.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Nenhum operador encontrado
                  </td>
                </tr>
              ) : (
                filteredOperadores.map((operador) => (
                  <tr key={operador.cd_operador} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {operador.cd_operador}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {operador.nm_operador}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {operador.cd_usuario_sw}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {operador.cod_empresa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={operador.sn_ativo === 'S' ? 'default' : 'secondary'}>
                        {operador.sn_ativo === 'S' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={operador.sn_logado === 'S' ? 'default' : 'secondary'}>
                        {operador.sn_logado === 'S' ? 'Sim' : 'Não'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <MaterialButton
                        variant="outline"
                        size="sm"
                        elevated={false}
                        onClick={() => handleEdit(operador)}
                        className="p-2"
                      >
                        <Edit className="h-4 w-4" />
                      </MaterialButton>
                      <MaterialButton
                        variant="destructive"
                        size="sm"
                        elevated={false}
                        onClick={() => handleDelete(operador.cd_operador)}
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
