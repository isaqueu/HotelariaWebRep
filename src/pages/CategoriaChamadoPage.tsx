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
      prioridade: 1,
      sn_ativo: 'S',
    },
  });

  const loadCategorias = async () => {
    try {
      setIsLoading(true);
      const data = await categoriaChamadoService.getAll();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast({ title: 'Erro ao carregar categorias', variant: 'destructive' });
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

  const filteredCategorias = categorias.filter(categoria =>
    categoria.ds_categoria_chamado.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorias de Chamado</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <MaterialButton onClick={openCreateModal} className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Categoria
            </MaterialButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
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
                  name="prioridade"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select 
                          value={field.value.toString()} 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a prioridade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Baixa</SelectItem>
                            <SelectItem value="2">Média</SelectItem>
                            <SelectItem value="3">Alta</SelectItem>
                            <SelectItem value="4">Crítica</SelectItem>
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
            label="Pesquisar categorias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCategorias.map((categoria) => (
          <MaterialCard key={categoria.cd_categoria_chamado} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{categoria.ds_categoria_chamado}</h3>
                <div className="flex gap-2 mt-2">
                  <Badge variant={categoria.prioridade === 4 ? 'destructive' : categoria.prioridade === 3 ? 'default' : 'secondary'}>
                    Prioridade: {categoria.prioridade === 1 ? 'Baixa' : categoria.prioridade === 2 ? 'Média' : categoria.prioridade === 3 ? 'Alta' : 'Crítica'}
                  </Badge>
                  <Badge variant={categoria.sn_ativo === 'S' ? 'default' : 'secondary'}>
                    {categoria.sn_ativo === 'S' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <MaterialButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(categoria)}
                >
                  <Edit className="w-4 h-4" />
                </MaterialButton>
                <MaterialButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(categoria.cd_categoria_chamado)}
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