import React from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'custom';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

// Opções de Configuração (Argumento Opcional)
// CORREÇÃO: Removemos 'message' daqui, pois ela é passada como 1º argumento da função.
export interface IToastOptions {
  title?: string;
  duration?: number; // Default: 4000ms
  
  // Configuração Visual
  position?: ToastPosition; 
  icon?: React.ReactNode;
  size?: 'normal' | 'large';
  
  // Ação
  action?: {
    label: string;
    onClick: () => void;
  };
};

// Objeto Interno Completo (Estado do Manager)
export interface IToast extends IToastOptions {
  id: string;
  type: ToastType;
  message: string; // A mensagem torna-se obrigatória apenas no objeto final construído
  createdAt: number;
};

export interface IToastItem {
  toast: IToast
};