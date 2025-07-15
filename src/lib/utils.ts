
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




