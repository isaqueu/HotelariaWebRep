
import { makeRequest } from "@/services/api";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"



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

export const removeAuthToken = () => {
  const tokenKey = (import.meta as any).env?.VITE_TOKEN_STORAGE_KEY || 'hotelaria_auth_token';
  localStorage.removeItem(tokenKey);
};

export const saveRefreshToken = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken);
};

export const encryptKey = async (key: string): Promise<string> => {
    // Codifica o texto original em base64
    const textoCodificado = btoa(key);
    try {
      // Aguarda a resolução das Promises para obter as máscaras
      const [mask1, mask2] = await Promise.all([
        makeRequest('/password-recovery/create-mask', 'POST'),
        makeRequest('/password-recovery/create-mask', 'POST'),
      ]);

      // Verifique se as máscaras estão retornando corretamente
      if (!mask1 || !mask2) {
        throw new Error('Máscaras inválidas recebidas da API');
      }

      // Embaralha a chave criptografada com as máscaras
      const textoComMascara = `${mask1}${textoCodificado}${mask2}`;

      // Codifica para URL ou JSON seguro
      const textoSeguro = encodeURIComponent(textoComMascara);

      return textoSeguro;
    } catch (error) {
      console.error('Erro ao embaralhar a chave:', error);
      throw new Error('Erro ao embaralhar a chave');
    }
  }


