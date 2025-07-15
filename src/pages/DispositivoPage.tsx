import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, Smartphone, Tablet, Edit, Trash2 } from 'lucide-react';
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
import { dispositivoApi } from '../services/api';
import type { Dispositivo } from '../types';

export function DispositivoPage() {
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Dispositivo | null>(null);

  const form = useForm<Omit<Dispositivo, 'cd_dispositivo'>>({
    defaultValues: {
      nm_dispositivo: '',
      tp_dispositivo: '',
      serial: '',
      app_versao_instalada: '',
      app_versao_atualizada: '',
      sn_ativo: 'S',
      sn_atualizacao_liberada: 'N',
    },
  });

  // Queries
  const { data: dispositivos = [], isLoading } = useQuery({
    queryKey: ['/api/dispositivo'],
    queryFn: () => dispositivoApi.getAll(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: Omit<Dispositivo, 'cd_dispositivo'>) =>
      dispositivoApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dispositivo'] });
      toast({ title: 'Dispositivo criado com sucesso!' });
      setIsCreateModalOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Erro ao criar dispositivo', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Dispositivo> }) =>
      dispositivoApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dispositivo'] });
      toast({ title: 'Dispositivo atualizado com sucesso!' });
      setEditingItem(null);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar dispositivo', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      dispositivoApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dispositivo'] });
      toast({ title: 'Dispositivo excluído com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro ao excluir dispositivo', variant: 'destructive' });
    },
  });

  const handleSubmit = (data: Omit<Dispositivo, 'cd_dispositivo'>) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.cd_dispositivo, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (dispositivo: Dispositivo) => {
    setEditingItem(dispositivo);
    form.reset(dispositivo);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este dispositivo?')) {
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
          <h1 className="text-3xl font-medium text-gray-800 mb-2">Dispositivos</h1>
          <p className="text-gray-600">Gerencie os dispositivos móveis do sistema</p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <MaterialButton onClick={openCreateModal} className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Novo Dispositivo
            </MaterialButton>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Dispositivo' : 'Novo Dispositivo'}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nm_dispositivo"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingLabelInput
                            label="Nome do Dispositivo"
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
                    name="tp_dispositivo"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo do Dispositivo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cel">Celular</SelectItem>
                              <SelectItem value="Tab">Tablet</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="serial"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingLabelInput
                            label="Número Serial"
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
                    name="app_versao_instalada"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingLabelInput
                            label="Versão Instalada"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="app_versao_atualizada"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingLabelInput
                            label="Versão Atualizada"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center space-x-6">
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
                    name="sn_atualizacao_liberada"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value === 'S'}
                            onCheckedChange={(checked) => field.onChange(checked ? 'S' : 'N')}
                          />
                        </FormControl>
                        <Label>Atualização Liberada</Label>
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

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dispositivos.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            Nenhum dispositivo encontrado
          </div>
        ) : (
          dispositivos.map((dispositivo) => (
            <MaterialCard key={dispositivo.cd_dispositivo} hover className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                    {dispositivo.tp_dispositivo === 'Tab' ? (
                      <Tablet className="h-5 w-5 text-secondary" />
                    ) : (
                      <Smartphone className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{dispositivo.nm_dispositivo}</h3>
                    <p className="text-sm text-gray-500">{dispositivo.tp_dispositivo === 'Tab' ? 'Tablet' : 'Celular'}</p>
                  </div>
                </div>
                <Badge variant={dispositivo.sn_ativo === 'S' ? 'default' : 'secondary'}>
                  {dispositivo.sn_ativo === 'S' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Serial:</span>
                  <span className="text-gray-800">{dispositivo.serial}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Versão:</span>
                  <span className="text-gray-800">{dispositivo.app_versao_instalada}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Atualização:</span>
                  <Badge variant={dispositivo.sn_atualizacao_liberada === 'S' ? 'default' : 'secondary'}>
                    {dispositivo.sn_atualizacao_liberada === 'S' ? 'Liberada' : 'Pendente'}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                <MaterialButton
                  variant="outline"
                  size="sm"
                  elevated={false}
                  onClick={() => handleEdit(dispositivo)}
                  className="p-2"
                >
                  <Edit className="h-4 w-4" />
                </MaterialButton>
                <MaterialButton
                  variant="destructive"
                  size="sm"
                  elevated={false}
                  onClick={() => handleDelete(dispositivo.cd_dispositivo)}
                  className="p-2"
                >
                  <Trash2 className="h-4 w-4" />
                </MaterialButton>
              </div>
            </MaterialCard>
          ))
        )}
      </div>
    </div>
  );
}