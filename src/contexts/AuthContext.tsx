import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { getAuthToken, saveAuthToken, removeAuthToken, saveRefreshToken, removeRefreshToken, saveExpiresAt, removeExpiresAt } from '../lib/utils';
import type { UserProfile } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userProfile: UserProfile | null;
  loginContexto: (username: string, password: string) => Promise<boolean>;
  renovaToken: () => Promise<boolean>;
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
        
        if (savedToken) {
          setToken(savedToken);

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
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loginContexto = async (username: string, password: string): Promise<boolean> => {

    try {
      const response = await authService.loginService({ USERNAME: username, EMAIL: '', PASSWORD: password });

      if (response.access_token && response?.refresh_token) {
        console.log('💾 [AuthContext] Salvando tokens...');
        saveAuthToken(response.access_token);
        saveExpiresAt(response.access_token);
        saveRefreshToken(response.refresh_token);
        setToken(response.access_token);

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

 const renovaToken = async (): Promise<boolean> => {

    try {
      const response = await authService.renovaTokenService();

      if (response.access_token && response?.refresh_token) {
        console.log('💾 [AuthContext] Renovando tokens...');
        saveAuthToken(response.access_token);
        saveExpiresAt(response.access_token);
        saveRefreshToken(response.refresh_token);
        setToken(response.access_token);
        
        console.log('✅ [AuthContext] token renovado com sucesso!');
        return true;
      }
      
      console.log('❌ [AuthContext] Renovar Token falhou - tokens ausentes na resposta');
      return false;
    } catch (error) {
      console.error('💥 [AuthContext] Erro no renovaToken:', error);
      
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
    removeExpiresAt();
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
    token,
    userProfile,
    loginContexto,
    renovaToken,
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