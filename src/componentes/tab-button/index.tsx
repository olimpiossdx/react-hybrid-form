import React from 'react';

interface TabButtonProps {
  /** ID único da aba para controle de estado */
  tabId: string;
  /** Texto exibido no botão */
  label: string;
  /** Se a aba está selecionada atualmente */
  isActive: boolean;
  /** Callback ao clicar */
  onClick: (tabId: string) => void;
  /** Classes CSS adicionais */
  className?: string;
}

const TabButton: React.FC<TabButtonProps> = ({ tabId, label, isActive, onClick, className = '' }) => {
  return (
    <button
      onClick={() => onClick(tabId)}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${
          isActive
            ? 'bg-cyan-600 text-white shadow-md scale-105'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
        }
        ${className}
      `}
      type="button"
      aria-pressed={isActive}>
      {label}
    </button>
  );
};

export default TabButton;
