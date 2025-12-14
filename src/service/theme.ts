import { graph } from "../core/native-bus";

export type Theme = 'light' | 'dark';
const STORAGE_KEY = 'hybrid-theme';

// Detecta preferência do sistema operacional se não houver salvo
const getSystemTheme = (): Theme => 
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const getCurrentTheme = (): Theme => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return (saved === 'light' || saved === 'dark') ? saved : getSystemTheme();
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  
  if (theme === 'dark') {
      root.classList.add('dark');
  } else {
      root.classList.remove('dark');
  }
  
  localStorage.setItem(STORAGE_KEY, theme);
};

// Inicializador (Chamado no App.tsx)
export const initThemeService = () => {
  // 1. Aplica estado inicial
  applyTheme(getCurrentTheme());

  // 2. Escuta mudanças via Barramento de Eventos
  // Ouve o evento 'sys:theme_change' definido no events.ts
  graph.on<any>('sys:theme_change', ({ theme }) => {
    applyTheme(theme);
  });
};