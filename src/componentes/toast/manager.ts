import type { IToast } from './types';

type Listener = (toasts: IToast[]) => void;

class ToastManager {
  private toasts: IToast[] = [];
  private listeners: Listener[] = [];

  subscribe(listener: Listener) {
    this.listeners.push(listener);

    // CORREÇÃO CRÍTICA:
    // Envia o estado atual imediatamente para o novo ouvinte.
    // Isso garante que o ToastContainer receba os toasts que foram adicionados
    // enquanto o React ainda estava montando o componente.
    listener(this.toasts);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.toasts));
  }

  add(toast: IToast) {
    this.toasts = [...this.toasts, toast];
    this.notify();
  }

  remove(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }
}

export const toastManager = new ToastManager();
