export interface ITabButtonProps {
  tabId: string;
  label: string;
  isActive: boolean;      // Recebe se ele está ativo
  onClick: React.Dispatch<React.SetStateAction<string>>;    // Recebe a função para clicar/ativar a tab
};

