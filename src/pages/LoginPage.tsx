import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hospital, User, Lock } from 'lucide-react';
import { FloatingLabelInput } from '../components/ui/floating-label-input';
import { MaterialButton } from '../components/ui/material-button';
import { MaterialCard } from '../components/ui/material-card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function LoginPage() {
  const navigate = useNavigate();
  const { loginContexto } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('🔄 [LoginPage] Iniciando processo de login...');

    try {
      const success = await loginContexto(formData.username, formData.password);

      if (success) {
        console.log('🎉 [LoginPage] Login bem-sucedido! Redirecionando para dashboard...');
        toast.success({
          title: 'Login realizado com sucesso',
          description: 'Bem-vindo ao HOTELARIA WEB',
        });
        navigate('/');
      } else {
        toast.error({
          title: 'Erro no login',
          description: 'Usuário ou senha inválidos',
        });
      }
    } catch (error) {
      console.error('💥 [LoginPage] Erro capturado durante login:', error);
      toast.error({
        title: 'Erro no login',
        description: 'Erro interno do servidor',
      });
    } finally {
      console.log('🏁 [LoginPage] Finalizando processo de login...');
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 px-4">
      {/* Exibe o valor da flag de mock para depuração */}
      <div style={{position: 'absolute', top: 10, right: 10, background: '#fff', color: '#333', padding: 4, borderRadius: 4, fontSize: 12, zIndex: 9999}}>
      </div>
      <MaterialCard elevation={4} className="p-8 w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
        {/* Hospital Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
            <Hospital className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-medium text-gray-800 mb-2">HOTELARIA WEB</h1>
          <p className="text-gray-600 text-sm">Sistema de Gestão Hospitalar</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <FloatingLabelInput
            label="Usuário"
            type="text"
            value={formData.username}
            onChange={handleInputChange('username')}
            icon={<User className="h-5 w-5" />}
            required
          />

          <FloatingLabelInput
            label="Senha"
            type="password"
            value={formData.password}
            onChange={handleInputChange('password')}
            icon={<Lock className="h-5 w-5" />}
            required
          />

          <MaterialButton
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? 'ENTRANDO...' : 'ENTRAR'}
          </MaterialButton>

          <div className="text-center">
            <a
              href="#"
              className="text-primary text-sm hover:text-primary/80 transition-colors duration-200"
            >
              Esqueceu sua senha?
            </a>
          </div>
        </form>
      </MaterialCard>
    </div>
  );
}