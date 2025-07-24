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
import { etapaService } from '../services/etapaService';
import { categoriaChamadoService } from '../services/categoriaChamadoService';
import { tipoOperadorService } from '../services/tipoOperadorService';
import type { Etapa, CategoriaChamado, TipoOperador } from '../types';

export function EtapaPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Etapa | null>(null);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [categorias, setCategorias] = useState<CategoriaChamado[]>([]);
  const [tiposOperador, setTiposOperador] = useState<TipoOperador[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<Omit<Etapa, 'cd_etapa'>>({
    defaultValues: {
      ds_etapa: '',
      ordem: 1,
      cd_categoria_chamado: 0,
      cd_tipo_operador: 0,
      sn_ativo: 'S',
      sn_le_qrcode: 'N',
    },
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [etapasData, categoriasData, tiposOperadorData] = await Promise.all([
        etapaService.getAll(),
        categoriaChamadoService.getAll(),
        tipoOperadorService.getAll(),
      ]);
      setEtapas(Array.isArray(etapasData) && etapasData.length >= 0 ? etapasData : []);
      setCategorias(Array.isArray(categoriasData) && categoriasData.length >= 0 ? categoriasData : []);
      setTiposOperador(Array.isArray(tiposOperadorData) && tiposOperadorData.length >= 0 ? tiposOperadorData : []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({ title: 'Erro ao carregar dados', variant: 'destructive' });
      setEtapas([]);
      setCategorias([]);
      setTiposOperador([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (data: Omit<Etapa, 'cd_etapa'>) => {
    try {
      if (editingItem) {
        await etapaService.update(editingItem.cd_etapa, data);
        toast({ title: 'Etapa atualizada com sucesso!' });
      } else {
        await etapaService.create(data);
        toast({ title: 'Etapa criada com sucesso!' });
      }
      setIsCreateModalOpen(false);
      setEditingItem(null);
      form.reset();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar etapa:', error);
      toast({ title: 'Erro ao salvar etapa', variant: 'destructive' });
    }
  };

  const handleEdit = (etapa: Etapa) => {
    setEditingItem(etapa);
    form.reset(etapa);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta etapa?')) {
      try {
        await etapaService.delete(id);
        toast({ title: 'Etapa excluída com sucesso!' });
        loadData();
      } catch (error) {
        console.error('Erro ao excluir etapa:', error);
        toast({ title: 'Erro ao excluir etapa', variant: 'destructive' });
      }
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    form.reset();
    setIsCreateModalOpen(true);
  };

  const filteredEtapas = (Array.isArray(etapas) && etapas.length > 0) ? etapas.filter(etapa =>
    etapa?.ds_etapa?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const getCategoriaName = (id: number) => {
    const categoria = categorias.find(c => c.cd_categoria_chamado === id);
    return categoria?.ds_categoria_chamado || 'Não informado';
  };

  const getTipoOperadorName = (id: number) => {
    const tipo = tiposOperador.find(t => t.cd_tipo_operador === id);
    return tipo?.ds_tipo_operador || 'Não informado';
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Etapas</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <MaterialButton onClick={openCreateModal} className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Etapa
            </MaterialButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Etapa' : 'Nova Etapa'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="ds_etapa"
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
                  name="ordem"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          label="Ordem"
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
                <FormField
                  control={form.control}
                  name="cd_categoria_chamado"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select 
                          value={field.value.toString()} 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categorias.map((categoria) => (
                              <SelectItem key={categoria.cd_categoria_chamado} value={categoria.cd_categoria_chamado.toString()}>
                                {categoria.ds_categoria_chamado}
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
                  name="cd_tipo_operador"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select 
                          value={field.value.toString()} 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de operador" />
                          </SelectTrigger>
                          <SelectContent>
                            {tiposOperador.map((tipo) => (
                              <SelectItem key={tipo.cd_tipo_operador} value={tipo.cd_tipo_operador.toString()}>
                                {tipo.ds_tipo_operador}
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
                  name="sn_le_qrcode"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value === 'S'}
                          onCheckedChange={(checked) => field.onChange(checked ? 'S' : 'N')}
                        />
                        <Label>Lê QRCode</Label>
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
            label="Pesquisar etapas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredEtapas.map((etapa) => (
          <MaterialCard key={etapa.cd_etapa} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{etapa.ds_etapa}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Ordem: {etapa.ordem} | Categoria: {getCategoriaName(etapa.cd_categoria_chamado)} | 
                  Tipo Operador: {getTipoOperadorName(etapa.cd_tipo_operador)}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant={etapa.sn_ativo === 'S' ? 'default' : 'secondary'}>
                    {etapa.sn_ativo === 'S' ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <Badge variant={etapa.sn_le_qrcode === 'S' ? 'default' : 'secondary'}>
                    {etapa.sn_le_qrcode === 'S' ? 'Lê QRCode' : 'Não lê QRCode'}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <MaterialButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(etapa)}
                >
                  <Edit className="w-4 h-4" />
                </MaterialButton>
                <MaterialButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(etapa.cd_etapa)}
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