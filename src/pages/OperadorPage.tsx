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
import { operadorService } from '../services/operadorService';
import type { Operador } from '../types';

export function OperadorPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Operador | null>(null);
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<Omit<Operador, 'cd_operador'>>({
    defaultValues: {
      nm_operador: '',
      cd_usuario_sw: '',
      cod_empresa: 1,
      sn_ativo: 'S',
      sn_logado: 'N',
    },
  });

  const loadOperadores = async () => {
    try {
      setIsLoading(true);
      const data = await operadorService.getAll();
      setOperadores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar operadores:', error);
      toast({ title: 'Erro ao carregar operadores', variant: 'destructive' });
      setOperadores([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOperadores();
  }, []);

  const handleSubmit = async (data: Omit<Operador, 'cd_operador'>) => {
    try {
      if (editingItem) {
        await operadorService.update(editingItem.cd_operador, data);
        toast({ title: 'Operador atualizado com sucesso!' });
      } else {
        await operadorService.create(data);
        toast({ title: 'Operador criado com sucesso!' });
      }
      setIsCreateModalOpen(false);
      setEditingItem(null);
      form.reset();
      loadOperadores();
    } catch (error) {
      console.error('Erro ao salvar operador:', error);
      toast({ title: 'Erro ao salvar operador', variant: 'destructive' });
    }
  };

  const handleEdit = (operador: Operador) => {
    setEditingItem(operador);
    form.reset(operador);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este operador?')) {
      try {
        await operadorService.delete(id);
        toast({ title: 'Operador excluído com sucesso!' });
        loadOperadores();
      } catch (error) {
        console.error('Erro ao excluir operador:', error);
        toast({ title: 'Erro ao excluir operador', variant: 'destructive' });
      }
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    form.reset();
    setIsCreateModalOpen(true);
  };

  // Filtered data
  const filteredOperadores = (Array.isArray(operadores) && operadores.length > 0) ? operadores.filter(operador =>
    operador?.nm_operador?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    operador?.cd_usuario_sw?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

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
        <div className="border border-blue-200/60 rounded-lg p-4 bg-white/50">
          <FloatingLabelInput
            label="Buscar operador..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-5 w-5" />}
          />
        </div>
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
                  Nome
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider border-r border-blue-200/40">
                  Usuário SW
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider border-r border-blue-200/40">
                  Empresa
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider border-r border-blue-200/40">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Logado
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-200/40">
              {filteredOperadores.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 border-b border-blue-200/20">
                    Nenhum operador encontrado
                  </td>
                </tr>
              ) : (
                filteredOperadores.map((operador) => (
                  <tr key={operador.cd_operador} className="hover:bg-blue-50/30 border-b border-blue-200/20">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-blue-200/20">
                      {operador.cd_operador}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-blue-200/20">
                      {operador.nm_operador}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-blue-200/20">
                      {operador.cd_usuario_sw}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-blue-200/20">
                      {operador.cod_empresa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r border-blue-200/20">
                      <Badge variant={operador.sn_ativo === 'S' ? 'default' : 'secondary'}>
                        {operador.sn_ativo === 'S' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r border-blue-200/20">
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
                        className="p-2 border border-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </MaterialButton>
                      <MaterialButton
                        variant="destructive"
                        size="sm"
                        elevated={false}
                        onClick={() => handleDelete(operador.cd_operador)}
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