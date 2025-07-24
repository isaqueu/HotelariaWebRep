import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { getAuthToken, saveAuthToken, removeAuthToken, saveRefreshToken, removeRefreshToken } from '../lib/utils';
import type { UserProfile } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  loginContexto: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicializa o contexto verificando se há token salvo
  useEffect(() => {
    const initializeAuth = async () => {
      
      try {
        const savedToken = getAuthToken();
        console.log('🔑 [AuthContext] Token salvo encontrado:', savedToken ? 'SIM' : 'NÃO');
        
        if (savedToken) {
          console.log('✅ [AuthContext] Definindo token no estado...');
          setToken(savedToken);

          console.log('👤 [AuthContext] Buscando perfil do usuário...');
          // Verifica se o token ainda é válido fazendo uma requisição para o perfil
          const profile = await authService.getProfile();
          console.log('📋 [AuthContext] Perfil obtido:', profile);
          setUserProfile(profile);
        } else {
          console.log('⚠️ [AuthContext] Nenhum token salvo encontrado');
        }
      } catch (error) {
        console.error('💥 [AuthContext] Erro ao inicializar autenticação:', error);
        console.log('🧹 [AuthContext] Removendo token inválido...');
        // Remove token inválido
        removeAuthToken();
        setToken(null);
        setUserProfile(null);
      } finally {
        console.log('🏁 [AuthContext] Inicialização concluída');
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loginContexto = async (username: string, password: string): Promise<boolean> => {
    console.log('🔄 [AuthContext] Iniciando loginContexto...');
    console.log('📝 [AuthContext] Dados recebidos:', {
      username,
      password: password ? '***' : 'vazio'
    });

    try {
      console.log('🚀 [AuthContext] Chamando authService.loginService...');
      const response = await authService.loginService({ USERNAME: username, EMAIL: '', PASSWORD: password });
      
      console.log('📨 [AuthContext] Resposta do authService:', {
        access_token: response.access_token ? 'PRESENTE' : 'AUSENTE',
        refresh_token: response.refresh_token ? 'PRESENTE' : 'AUSENTE',
        user: response.user ? 'PRESENTE' : 'AUSENTE'
      });

      if (response.access_token && response?.refresh_token) {
        console.log('💾 [AuthContext] Salvando tokens...');
        saveAuthToken(response.access_token);
        saveRefreshToken(response.refresh_token);
        setToken(response.access_token);

        console.log('👤 [AuthContext] Buscando perfil do usuário após loginContexto...');
        // Busca o perfil do usuário após login
        const profile = await authService.getProfile();
        console.log('📋 [AuthContext] Perfil obtido após loginContexto:', profile);
        setUserProfile(profile);
        
        console.log('✅ [AuthContext] loginContexto concluído com sucesso!');
        return true;
      }
      
      console.log('❌ [AuthContext] loginContexto falhou - tokens ausentes na resposta');
      return false;
    } catch (error) {
      console.error('💥 [AuthContext] Erro no loginContexto:', error);
      
      // Log detalhado do erro
      if (error instanceof Error) {
        console.error('📝 [AuthContext] Mensagem do erro:', error.message);
        console.error('📚 [AuthContext] Stack trace:', error.stack);
      }
      
      return false;
    }
  };

  const logout = () => {
    console.log('🔄 [AuthContext] Iniciando logout...');
    console.log('🧹 [AuthContext] Removendo tokens de autenticação...');
    removeAuthToken();
    removeRefreshToken();
    console.log('🔄 [AuthContext] Limpando estado do usuário...');
    setToken(null);
    setUserProfile(null);
    console.log('🚀 [AuthContext] Redirecionando para login...');
    navigate('/login');
    console.log('✅ [AuthContext] Logout concluído!');
  };

  const value = {
    isAuthenticated: !!token,
    userProfile,
    loginContexto,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}