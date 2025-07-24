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
      setDispositivos(data);
    } catch (error) {
      console.error('Erro ao carregar dispositivos:', error);
      toast({ title: 'Erro ao carregar dispositivos', variant: 'destructive' });
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

  const filteredDispositivos = Array.isArray(dispositivos) ? dispositivos.filter(dispositivo =>
    dispositivo.nm_dispositivo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dispositivo.tp_dispositivo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dispositivo.serial.toLowerCase().includes(searchQuery.toLowerCase())
  ): [];

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dispositivos</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <MaterialButton onClick={openCreateModal} className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Dispositivo
            </MaterialButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
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
                  name="sn_atualizacao_liberada"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value === 'S'}
                          onCheckedChange={(checked) => field.onChange(checked ? 'S' : 'N')}
                        />
                        <Label>Atualização Liberada</Label>
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
            label="Pesquisar dispositivos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredDispositivos.map((dispositivo) => (
          <MaterialCard key={dispositivo.cd_dispositivo} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{dispositivo.nm_dispositivo}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Tipo: {dispositivo.tp_dispositivo} | Serial: {dispositivo.serial}
                </p>
                <p className="text-sm text-gray-600">
                  Versão Instalada: {dispositivo.app_versao_instalada} | Versão Atualizada: {dispositivo.app_versao_atualizada}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant={dispositivo.sn_ativo === 'S' ? 'default' : 'secondary'}>
                    {dispositivo.sn_ativo === 'S' ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <Badge variant={dispositivo.sn_atualizacao_liberada === 'S' ? 'default' : 'secondary'}>
                    {dispositivo.sn_atualizacao_liberada === 'S' ? 'Atualização Liberada' : 'Atualização Bloqueada'}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <MaterialButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(dispositivo)}
                >
                  <Edit className="w-4 h-4" />
                </MaterialButton>
                <MaterialButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(dispositivo.cd_dispositivo)}
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