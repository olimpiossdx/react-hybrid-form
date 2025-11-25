import React from 'react';

interface TabButtonProps {
  tabId: string;
  label: string;
  isActive: boolean;      // Recebe se ele está ativo
  onClick: () => void;    // Recebe a função para clicar
}

const TabButton: React.FC<TabButtonProps> = ({
  label,
  isActive,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 sm:px-4 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? "bg-cyan-600 text-white" // Estilo Ativo
          : "bg-gray-700 text-gray-300 hover:bg-gray-600" // Estilo Inativo
      }`}
    >
      {label}
    </button>
  );
};

export default TabButton;