import { HttpClient } from './http/client';
import { smartAdapter } from './http/adapters';

// ÚNICA INSTÂNCIA (Singleton)
// Configuramos o padrão "Enterprise" (StandardAdapter) como default.
export const api = new HttpClient({
    baseURL: 'https://api.meusistema.com/v1',
    defaultAdapter: smartAdapter
});

// --- INTERCEPTORS ---

api.useRequestInterceptor(async (config) => {
  const token = localStorage.getItem('token');
  
  // Garante que headers é um objeto Headers para podermos usar .set()
  if (!config.headers) {
    config.headers = new Headers();
  } else if (!(config.headers instanceof Headers)) {
    config.headers = new Headers(config.headers);
  }

  // Lógica de Segurança: Só injeta token se for para nossa API interna
  const isInternal = !config.url?.startsWith('http') || config.url?.includes('api.meusistema.com');
  
  if (token && isInternal) {
      config.headers.set('Authorization', `Bearer ${token}`);
  }
  
  return config;
});