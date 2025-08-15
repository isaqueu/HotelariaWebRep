import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MaterialButton } from '@/components/ui/material-button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

interface TokenExpirationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRenew: () => void;
  onLogout: () => void;
}

export function TokenExpirationModal({ 
  isOpen, 
  onOpenChange,
  onRenew,
  onLogout
}: TokenExpirationModalProps) {
  const { renovaToken } = useAuth();
  const { toast } = useToast();
  const [isRenewing, setIsRenewing] = useState(false);

    const [countdown, setCountdown] = useState(60); // ⏳ começa com 60 segundos

  // ⏱️ Reduz o contador a cada segundo quando o modal estiver aberto
  useEffect(() => {
    if (!isOpen) {
      setCountdown(60); // Reset ao fechar
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleLogout(); // 🚪 Logout automático
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Limpa quando modal fecha
  }, [isOpen]);


  const handleRenew = async () => {
    setIsRenewing(true);
    try {
      const success = await renovaToken();
      if (success) {
        toast.success({
          title: 'Sessão renovada',
          description: 'Sua sessão foi renovada com sucesso!',
        });
        onOpenChange(false);
      } else {
        toast.error({
          title: 'Falha na renovação',
          description: 'Não foi possível renovar sua sessão. Faça login novamente.',
        });
        onLogout();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('💥 [TokenExpirationModal] Erro ao renovar token:', error);
      toast.error({
        title: 'Erro',
        description: 'Ocorreu um erro ao renovar sua sessão.',
      });
      onLogout();
      onOpenChange(false);
    } finally {
      setIsRenewing(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Sessão expirando</DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-4">
          <p className="text-muted-foreground mb-2">
            Sua sessão vai expirar em breve. Deseja renovar a sessão?
          </p>
          <p className="font-semibold text-red-600">
            Você será desconectado em <span>{countdown}</span> segundos.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <MaterialButton
            variant="primary"
            onClick={handleRenew}
            disabled={isRenewing}
            className="w-full"
          >
            {isRenewing ? 'Renovando...' : 'Renovar Sessão'}
          </MaterialButton>
          
          <MaterialButton
            variant="destructive"
            onClick={handleLogout}
            disabled={isRenewing}
            className="w-full"
          >
            Sair
          </MaterialButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}