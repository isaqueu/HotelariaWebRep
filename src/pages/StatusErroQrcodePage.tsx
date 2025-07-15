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
import { statusErroQrcodeApi, categoriaChamadoApi } from '../services/api';
import { mockDataService } from '../services/mockService';
import { useMock } from '../contexts/MockContext';
import type { StatusErroQrcode } from '../types';

export function StatusErroQrcodePage() {
  const { useMock: mockMode } = useMock();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StatusErroQrcode | null>(null);

  const form = useForm<Omit<StatusErroQrcode, 'cd_status_erro_qrcode'>>({
    defaultValues: {
      ds_status_erro_qrcode: '',
      cd_categoria_chamado: undefined,
      sn_ativo: 'S',
    },
  });

  // Queries
  const { data: statusErros = [], isLoading } = useQuery({
    queryKey: ['/api/status-erro-qrcode'],
    queryFn: () => mockMode ? mockDataService.getStatusErroQrcode() : statusErroQrcodeApi.getAll(),
  });

  const { data: categorias = [] } = useQuery({
    queryKey: ['/api/categoria-chamado'],
    queryFn: () => mockMode ? mockDataService.getCategoriasChamado() : categoriaChamadoApi.getAll(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: Omit<StatusErroQrcode, 'cd_status_erro_qrcode'>) =>
      mockMode ? mockDataService.createStatusErroQrcode(data) : statusErroQrcodeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/status-erro-qrcode'] });
      toast({ title: 'Status de erro QRCode criado com sucesso!' });
      setIsCreateModalOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Erro ao criar status de erro QRCode', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<StatusErroQrcode> }) =>
      mockMode ? mockDataService.updateStatusErroQrcode(id, data) : statusErroQrcodeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/status-erro-qrcode'] });
      toast({ title: 'Status de erro QRCode atualizado com sucesso!' });
      setEditingItem(null);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar status de erro QRCode', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      mockMode ? mockDataService.deleteStatusErroQrcode(id) : statusErroQrcodeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/status-erro-qrcode'] });
      toast({ title: 'Status de erro QRCode excluído com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro ao excluir status de erro QRCode', variant: 'destructive' });
    },
  });

  // Filtered data
  const filteredStatus = statusErros.filter(status =>
    status.ds_status_erro_qrcode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (data: Omit<StatusErroQrcode, 'cd_status_erro_qrcode'>) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.cd_status_erro_qrcode, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (status: StatusErroQrcode) => {
    setEditingItem(status);
    form.reset(status);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este status de erro QRCode?')) {
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
          label="Buscar status..."
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
                  Categoria
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
              {filteredStatus.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nenhum status encontrado
                  </td>
                </tr>
              ) : (
                filteredStatus.map((status) => {
                  const categoria = categorias.find(c => c.cd_categoria_chamado === status.cd_categoria_chamado);
                  return (
                    <tr key={status.cd_status_erro_qrcode} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {status.cd_status_erro_qrcode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {status.ds_status_erro_qrcode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {categoria?.ds_categoria_chamado || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                          className="p-2"
                        >
                          <Edit className="h-4 w-4" />
                        </MaterialButton>
                        <MaterialButton
                          variant="destructive"
                          size="sm"
                          elevated={false}
                          onClick={() => handleDelete(status.cd_status_erro_qrcode)}
                          className="p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </MaterialButton>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </MaterialCard>
    </div>
  );
}
