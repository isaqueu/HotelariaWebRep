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
import { dispositivoService } from '../services/dispositivoService';
import type { Dispositivo } from '../types';

export function DispositivoPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Dispositivo | null>(null);
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const loadDispositivos = async () => {
    try {
      setIsLoading(true);
      const data = await dispositivoService.getAll();
      setDispositivos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar dispositivos:', error);
      toast({ title: 'Erro ao carregar dispositivos', variant: 'destructive' });
      setDispositivos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDispositivos();
  }, []);

  const handleSubmit = async (data: Omit<Dispositivo, 'cd_dispositivo'>) => {
    try {
      if (editingItem) {
        await dispositivoService.update(editingItem.cd_dispositivo, data);
        toast({ title: 'Dispositivo atualizado com sucesso!' });
      } else {
        await dispositivoService.create(data);
        toast({ title: 'Dispositivo criado com sucesso!' });
      }
      setIsCreateModalOpen(false);
      setEditingItem(null);
      form.reset();
      loadDispositivos();
    } catch (error) {
      console.error('Erro ao salvar dispositivo:', error);
      toast({ title: 'Erro ao salvar dispositivo', variant: 'destructive' });
    }
  };

  const handleEdit = (dispositivo: Dispositivo) => {
    setEditingItem(dispositivo);
    form.reset(dispositivo);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este dispositivo?')) {
      try {
        await dispositivoService.delete(id);
        toast({ title: 'Dispositivo excluído com sucesso!' });
        loadDispositivos();
      } catch (error) {
        console.error('Erro ao excluir dispositivo:', error);
        toast({ title: 'Erro ao excluir dispositivo', variant: 'destructive' });
      }
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    form.reset();
    setIsCreateModalOpen(true);
  };

  const filteredDispositivos = (Array.isArray(dispositivos) && dispositivos.length > 0) ? dispositivos.filter(dispositivo =>
    dispositivo?.nm_dispositivo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dispositivo?.tp_dispositivo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dispositivo?.serial?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium text-gray-800 mb-2">Dispositivos</h1>
          <p className="text-gray-600">Gerencie os dispositivos registrados no sistema</p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <MaterialButton onClick={openCreateModal} className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Novo Dispositivo
            </MaterialButton>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Dispositivo' : 'Novo Dispositivo'}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                        <FloatingLabelInput
                          label="Tipo do Dispositivo"
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
                  name="serial"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          label="Serial"
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
          <FloatingLabelInput
            label="Buscar dispositivo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-5 w-5" />}
          />
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
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider border-r border-blue-200/40">
                  Serial
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider border-r border-blue-200/40">
                  Versões
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
              {filteredDispositivos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 border-b border-blue-200/20">
                    Nenhum dispositivo encontrado
                  </td>
                </tr>
              ) : (
                filteredDispositivos.map((dispositivo) => (
                  <tr key={dispositivo.cd_dispositivo} className="hover:bg-blue-50/30 border-b border-blue-200/20">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-blue-200/20">
                      {dispositivo.cd_dispositivo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-blue-200/20">
                      {dispositivo.nm_dispositivo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-blue-200/20">
                      {dispositivo.tp_dispositivo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-blue-200/20">
                      {dispositivo.serial}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-blue-200/20">
                      <div className="space-y-1">
                        <div>Inst: {dispositivo.app_versao_instalada}</div>
                        <div>Atual: {dispositivo.app_versao_atualizada}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r border-blue-200/20">
                      <div className="space-y-1">
                        <Badge variant={dispositivo.sn_ativo === 'S' ? 'default' : 'secondary'}>
                          {dispositivo.sn_ativo === 'S' ? 'Ativo' : 'Inativo'}
                        </Badge>
                        <Badge variant={dispositivo.sn_atualizacao_liberada === 'S' ? 'default' : 'secondary'}>
                          {dispositivo.sn_atualizacao_liberada === 'S' ? 'Atualização Liberada' : 'Atualização Bloqueada'}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <MaterialButton
                        variant="outline"
                        size="sm"
                        elevated={false}
                        onClick={() => handleEdit(dispositivo)}
                        className="p-2 border border-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </MaterialButton>
                      <MaterialButton
                        variant="destructive"
                        size="sm"
                        elevated={false}
                        onClick={() => handleDelete(dispositivo.cd_dispositivo)}
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