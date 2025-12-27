import React from 'react';
import { Moon, Sun } from 'lucide-react';

import { useGraphBus } from '../../hooks/native-bus';
import { getCurrentTheme, type Theme } from '../../service/theme';

// Interface local simplificada ou importada de events.ts
interface ThemeEvents {
  'sys:theme_change': { theme: 'light' | 'dark' };
}

export const ThemeToggle = () => {
  const { emit, on } = useGraphBus<ThemeEvents>();
  const [theme, setTheme] = React.useState<Theme>(getCurrentTheme());

  React.useEffect(() => {
    // Sincroniza o ícone caso o tema mude por outro lugar
    return on('sys:theme_change', ({ theme: newTheme }) => {
      setTheme(newTheme);
    });
  }, [on]);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    emit('sys:theme_change', { theme: next });
  };

  return (
    <button
      onClick={toggle}
      className={`
        p-2 rounded-lg border transition-all duration-300
        ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700 text-yellow-400 hover:bg-gray-700'
            : 'bg-white border-gray-200 text-orange-500 hover:bg-gray-100 shadow-sm'
        }
      `}
      title={`Alternar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}>
      {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};
