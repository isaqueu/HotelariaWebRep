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
import { statusErroQrcodeService } from '../services/statusErroQrcodeService';
import { categoriaChamadoService } from '../services/categoriaChamadoService';
import type { StatusErroQrcode, CategoriaChamado } from '../types';

export function StatusErroQrcodePage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StatusErroQrcode | null>(null);
  const [statusErros, setStatusErros] = useState<StatusErroQrcode[]>([]);
  const [categorias, setCategorias] = useState<CategoriaChamado[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<Omit<StatusErroQrcode, 'cd_status_erro_qrcode'>>({
    defaultValues: {
      ds_status_erro_qrcode: '',
      cd_categoria_chamado: undefined,
      sn_ativo: 'S',
    },
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [statusErrosData, categoriasData] = await Promise.all([
        statusErroQrcodeService.getAll(),
        categoriaChamadoService.getAll(),
      ]);
      setStatusErros(Array.isArray(statusErrosData) ? statusErrosData : []);
      setCategorias(Array.isArray(categoriasData) && categoriasData.length >= 0 ? categoriasData : []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({ title: 'Erro ao carregar dados', variant: 'destructive' });
      setStatusErros([]);
      setCategorias([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (data: Omit<StatusErroQrcode, 'cd_status_erro_qrcode'>) => {
    try {
      if (editingItem) {
        await statusErroQrcodeService.update(editingItem.cd_status_erro_qrcode, data);
        toast({ title: 'Status de erro QRCode atualizado com sucesso!' });
      } else {
        await statusErroQrcodeService.create(data);
        toast({ title: 'Status de erro QRCode criado com sucesso!' });
      }
      setIsCreateModalOpen(false);
      setEditingItem(null);
      form.reset();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar status de erro QRCode:', error);
      toast({ title: 'Erro ao salvar status de erro QRCode', variant: 'destructive' });
    }
  };

  const handleEdit = (status: StatusErroQrcode) => {
    setEditingItem(status);
    form.reset(status);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este status de erro QRCode?')) {
      try {
        await statusErroQrcodeService.delete(id);
        toast({ title: 'Status de erro QRCode excluído com sucesso!' });
        loadData();
      } catch (error) {
        console.error('Erro ao excluir status de erro QRCode:', error);
        toast({ title: 'Erro ao excluir status de erro QRCode', variant: 'destructive' });
      }
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    form.reset();
    setIsCreateModalOpen(true);
  };

  // Filtered data
  const filteredStatus = (Array.isArray(statusErros) && statusErros.length > 0) ? statusErros.filter(status =>
    status?.ds_status_erro_qrcode?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium text-gray-800 mb-2">Status Erro QRCode</h1>
          <p className="text-gray-600">Gerencie os possíveis status quando ocorrem erros na leitura de QRCode</p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <MaterialButton onClick={openCreateModal} className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Novo Status
            </MaterialButton>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Status Erro QRCode' : 'Novo Status Erro QRCode'}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="ds_status_erro_qrcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          label="Descrição do Status"
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
                  name="cd_categoria_chamado"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value && field.value > 0 ? field.value.toString() : ""}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Categoria do Chamado" />
                          </SelectTrigger>
                          <SelectContent>
                            {categorias.map((categoria) => (
                              <SelectItem
                                key={categoria.cd_categoria_chamado}
                                value={categoria.cd_categoria_chamado.toString()}
                              >
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
            label="Buscar status erro QRCode..."
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
                  Categoria
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
              {filteredStatus.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 border-b border-blue-200/20">
                    Nenhum status erro QRCode encontrado
                  </td>
                </tr>
              ) : (
                filteredStatus.map((status) => (
                  <tr key={status.cd_status_erro_qrcode} className="hover:bg-blue-50/30 border-b border-blue-200/20">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-blue-200/20">
                      {status.cd_status_erro_qrcode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-blue-200/20">
                      {status.ds_status_erro_qrcode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-blue-200/20">
                      {categoria?.ds_categoria_chamado || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r border-blue-200/20">
                      <Badge variant={status.sn_ativo === 'S' ? 'default' : 'secondary'}>
                        {status.sn_ativo === 'S' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <MaterialButton
                        variant="outline"
                        size="sm"
                        elevated={false}
                        onClick={() => handleEdit(status)}
                        className="p-2 border border-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </MaterialButton>
                      <MaterialButton
                        variant="destructive"
                        size="sm"
                        elevated={false}
                        onClick={() => handleDelete(status.cd_status_erro_qrcode)}
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