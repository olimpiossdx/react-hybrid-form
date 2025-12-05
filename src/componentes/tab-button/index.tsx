import React from 'react';
import type { ITabButtonProps } from './props';

const TabButton: React.FC<ITabButtonProps> = ({ tabId,  label,  isActive,  onClick }) => {
  return (<button id={tabId} onClick={() => onClick(tabId)}
      className={`
        px-3 py-2 sm:px-4 text-sm font-medium rounded-md transition-all duration-200
        ${isActive
          ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/50 scale-105" // Estilo Ativo
          : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-700"// Estilo Inativo
        }
      `}>
      {label}
    </button>);
};

export default TabButton;