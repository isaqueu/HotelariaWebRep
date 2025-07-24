
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
import { categoriaChamadoService } from '../services/categoriaChamadoService';
import type { CategoriaChamado } from '../types';

export function CategoriaChamadoPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoriaChamado | null>(null);
  const [categorias, setCategorias] = useState<CategoriaChamado[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<Omit<CategoriaChamado, 'cd_categoria_chamado'>>({
    defaultValues: {
      ds_categoria_chamado: '',
      sn_ativo: 'S',
    },
  });

  const loadCategorias = async () => {
    try {
      setIsLoading(true);
      const data = await categoriaChamadoService.getAll();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast({ title: 'Erro ao carregar categorias', variant: 'destructive' });
      setCategorias([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  const handleSubmit = async (data: Omit<CategoriaChamado, 'cd_categoria_chamado'>) => {
    try {
      if (editingItem) {
        await categoriaChamadoService.update(editingItem.cd_categoria_chamado, data);
        toast({ title: 'Categoria de chamado atualizada com sucesso!' });
      } else {
        await categoriaChamadoService.create(data);
        toast({ title: 'Categoria de chamado criada com sucesso!' });
      }
      setIsCreateModalOpen(false);
      setEditingItem(null);
      form.reset();
      loadCategorias();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      toast({ title: 'Erro ao salvar categoria de chamado', variant: 'destructive' });
    }
  };

  const handleEdit = (categoria: CategoriaChamado) => {
    setEditingItem(categoria);
    form.reset(categoria);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta categoria de chamado?')) {
      try {
        await categoriaChamadoService.delete(id);
        toast({ title: 'Categoria de chamado excluída com sucesso!' });
        loadCategorias();
      } catch (error) {
        console.error('Erro ao excluir categoria:', error);
        toast({ title: 'Erro ao excluir categoria de chamado', variant: 'destructive' });
      }
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    form.reset();
    setIsCreateModalOpen(true);
  };

  const filteredCategorias = (Array.isArray(categorias) && categorias.length > 0) ? categorias.filter(categoria =>
    categoria?.ds_categoria_chamado?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium text-gray-800 mb-2">Categorias de Chamado</h1>
          <p className="text-gray-600">Gerencie as categorias de chamado disponíveis no sistema</p>
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
                {editingItem ? 'Editar Categoria' : 'Nova Categoria de Chamado'}
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
        <div className="border border-blue-200/60 rounded-lg p-4 bg-white/50">
          <FloatingLabelInput
            label="Buscar categoria de chamado..."
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
                  Descrição
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider border-r border-blue-200/40">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-200/40">
              {filteredCategorias.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 border-b border-blue-200/20">
                    Nenhuma categoria de chamado encontrada
                  </td>
                </tr>
              ) : (
                filteredCategorias.map((categoria) => (
                  <tr key={categoria.cd_categoria_chamado} className="hover:bg-blue-50/30 border-b border-blue-200/20">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-blue-200/20">
                      {categoria.cd_categoria_chamado}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-blue-200/20">
                      {categoria.ds_categoria_chamado}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r border-blue-200/20">
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
                        className="p-2 border border-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </MaterialButton>
                      <MaterialButton
                        variant="destructive"
                        size="sm"
                        elevated={false}
                        onClick={() => handleDelete(categoria.cd_categoria_chamado)}
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
