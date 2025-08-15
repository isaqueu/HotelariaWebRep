
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hospital, Mail, ArrowLeft } from 'lucide-react';
import { FloatingLabelInput } from '../components/ui/floating-label-input';
import { MaterialButton } from '../components/ui/material-button';
import { MaterialCard } from '../components/ui/material-card';
import { authService } from '../services/authService';
import { useToast } from '@/hooks/use-toast';

export function ResetSenhaPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Função para validar email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.passwordRecovery(email);
      
      toast({
        title: 'Email enviado com sucesso',
        description: 'Verifique sua caixa de entrada para instruções de recuperação de senha.',
      });
      
      setIsEmailSent(true);
    } catch (error) {
      console.error('💥 [ResetSenhaPage] Erro ao enviar email de recuperação:', error);
      toast({
        title: 'Erro ao enviar email',
        description: 'Ocorreu um erro ao enviar o email de recuperação. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 px-4">
        <MaterialCard elevation={4} className="p-8 w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-medium text-gray-800 mb-2">Email Enviado!</h1>
            <p className="text-gray-600 text-sm">
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-primary text-sm hover:text-primary/80 transition-colors duration-200 inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao login
            </Link>
          </div>
        </MaterialCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 px-4">
      <MaterialCard elevation={4} className="p-8 w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
        {/* Hospital Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
            <Hospital className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-medium text-gray-800 mb-2">Recuperar Senha</h1>
          <p className="text-gray-600 text-sm">Digite seu email para receber instruções de recuperação</p>
        </div>

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <FloatingLabelInput
            label="Digite seu email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-5 w-5" />}
            required
          />

          <MaterialButton
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || !isValidEmail(email)}
          >
            {isLoading ? 'ENVIANDO...' : 'ENVIAR'}
          </MaterialButton>

          <div className="text-center">
            <Link
              to="/login"
              className="text-primary text-sm hover:text-primary/80 transition-colors duration-200 inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao login
            </Link>
          </div>
        </form>
      </MaterialCard>
    </div>
  );
}
