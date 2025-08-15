import api from "@/services/api";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import {jwtDecode} from 'jwt-decode';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getAuthToken = () => {
  const tokenKey = (import.meta as any).env?.VITE_TOKEN_STORAGE_KEY || 'hotelaria_auth_token';
  return localStorage.getItem(tokenKey);
};

export const saveAuthToken = (authToken: string) => {
  const tokenKey = (import.meta as any).env?.VITE_TOKEN_STORAGE_KEY || 'hotelaria_auth_token';
  localStorage.setItem(tokenKey, authToken);
};

export const removeAuthToken = (): void => {
  const tokenKey = (import.meta as any).env?.VITE_TOKEN_STORAGE_KEY || 'hotelaria_auth_token';
  localStorage.removeItem(tokenKey);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

export const removeRefreshToken = (): void => {
  const refreshTokenKey = 'refreshToken';
  localStorage.removeItem(refreshTokenKey);
};

export const saveRefreshToken = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken);
};

export const saveExpiresAt = (authToken: string) => {
  // Decodifica o token para obter o tempo de expiração
  const decodedToken: { exp: number } = jwtDecode(authToken);

  // `exp` já está em segundos, então só convertemos para milissegundos
  const expiresAt = decodedToken.exp * 1000;

  localStorage.setItem('expiresAt', String(expiresAt));

  console.log('Token salvo com expiração:', new Date(expiresAt).toISOString());
};

export const removeExpiresAt = (): void => {
  localStorage.removeItem('expiresAt');
};

export const getExpiresAt = (): string | null => {
  return localStorage.getItem('expiresAt');
};

export const encryptKey = async (key: string): Promise<string> => {
  // Codifica o texto original em base64
  const textoCodificado = btoa(key);
  try {
    // Aguarda a resolução das Promises para obter as máscaras
    const [mask1, mask2] = await Promise.all([
      api.post('/password-recovery/create-mask'),
      api.post('/password-recovery/create-mask'),
    ]);

    // Verifique se as máscaras estão retornando corretamente
    if (!mask1.data || !mask2.data) {
      throw new Error('Máscaras inválidas recebidas da API');
    }

    // Embaralha a chave criptografada com as máscaras
    const textoComMascara = `${mask1.data}${textoCodificado}${mask2.data}`;

    // Codifica para URL ou JSON seguro
    const textoSeguro = encodeURIComponent(textoComMascara);

    return textoSeguro;
  } catch (error) {
    console.error('Erro ao embaralhar a chave:', error);
    throw new Error('Erro ao embaralhar a chave');
  }
}