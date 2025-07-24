
import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { MaterialCard } from '../components/ui/material-card';
import { MaterialButton } from '../components/ui/material-button';
import { FloatingLabelInput } from '../components/ui/floating-label-input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { tipoAcessoService } from '../services/tipoAcessoService';
import type { TipoAcesso } from '../types';

export function TipoAcessoPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TipoAcesso | null>(null);
  const [tiposAcesso, setTiposAcesso] = useState<TipoAcesso[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<Omit<TipoAcesso, 'cd_tipo_acesso'>>({
    defaultValues: {
      ds_tipo_acesso: '',
    },
  });

  const loadTiposAcesso = async () => {
    try {
      setIsLoading(true);
      const data = await tipoAcessoService.getAll();
      setTiposAcesso(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar tipos de acesso:', error);
      toast({ title: 'Erro ao carregar tipos de acesso', variant: 'destructive' });
      setTiposAcesso([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTiposAcesso();
  }, []);

  const handleSubmit = async (data: Omit<TipoAcesso, 'cd_tipo_acesso'>) => {
    try {
      if (editingItem) {
        await tipoAcessoService.update(editingItem.cd_tipo_acesso, data);
        toast({ title: 'Tipo de acesso atualizado com sucesso!' });
      } else {
        await tipoAcessoService.create(data);
        toast({ title: 'Tipo de acesso criado com sucesso!' });
      }
      setIsCreateModalOpen(false);
      setEditingItem(null);
      form.reset();
      loadTiposAcesso();
    } catch (error) {
      console.error('Erro ao salvar tipo de acesso:', error);
      toast({ title: 'Erro ao salvar tipo de acesso', variant: 'destructive' });
    }
  };

  const handleEdit = (tipo: TipoAcesso) => {
    setEditingItem(tipo);
    form.reset(tipo);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este tipo de acesso?')) {
      try {
        await tipoAcessoService.delete(id);
        toast({ title: 'Tipo de acesso excluído com sucesso!' });
        loadTiposAcesso();
      } catch (error) {
        console.error('Erro ao excluir tipo de acesso:', error);
        toast({ title: 'Erro ao excluir tipo de acesso', variant: 'destructive' });
      }
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    form.reset();
    setIsCreateModalOpen(true);
  };

  // Filtered data
  const filteredTipos = Array.isArray(tiposAcesso) ? tiposAcesso.filter(tipo =>
    tipo.ds_tipo_acesso.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium text-gray-800 mb-2">Tipos de Acesso</h1>
          <p className="text-gray-600">Gerencie os tipos de acesso no sistema</p>
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
                {editingItem ? 'Editar Tipo de Acesso' : 'Novo Tipo de Acesso'}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="ds_tipo_acesso"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          label="Descrição do Tipo de Acesso"
                          {...field}
                          required
                        />
                      </FormControl>
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
          label="Buscar tipo de acesso..."
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
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTipos.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    Nenhum tipo de acesso encontrado
                  </td>
                </tr>
              ) : (
                filteredTipos.map((tipo) => (
                  <tr key={tipo.cd_tipo_acesso} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {tipo.cd_tipo_acesso}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tipo.ds_tipo_acesso}
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
                        onClick={() => handleDelete(tipo.cd_tipo_acesso)}
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
