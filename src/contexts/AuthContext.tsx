import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { getAuthToken, saveAuthToken, removeAuthToken, saveRefreshToken } from '../lib/utils';
import type { UserProfile } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  login: (username: string, password: string) => Promise<boolean>;
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
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
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

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ username, password });

      if (response.access_token && response?.refresh_token) {
        saveAuthToken(response.access_token);
        saveRefreshToken(response.refresh_token)
        setToken(response.access_token);

        // Busca o perfil do usuário após login
        const profile = await authService.getProfile();
        setUserProfile(profile);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    removeAuthToken();
    setToken(null);
    setUserProfile(null);
    navigate('/login');
  };

  const value = {
    isAuthenticated: !!token,
    userProfile,
    login,
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