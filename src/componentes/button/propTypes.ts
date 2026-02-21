// --- Interfaces ---

// O "Super Ref": É um botão HTML nativo + nossos métodos customizados
export interface IButtonElement extends HTMLButtonElement {
  setLoading: (loading: boolean) => void;
  loading: boolean;
}

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Estilo visual do botão.
   * - 'primary': O clássico de alto contraste (Azul sólido).
   * - 'primary-soft': Tom sobre tom (Fundo translúcido com texto azul).
   */
  variant?: 'primary' | 'primary-soft' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';

  /**
   * Tamanho do botão (Alinhado com Inputs).
   * - 'sm': 32px (Compacto)
   * - 'md': 40px (Padrão)
   * - 'lg': 48px (Expandido)
   * - 'icon': Quadrado para ícones
   */
  size?: 'sm' | 'md' | 'lg' | 'icon';

  /**
   * Estado de carregamento (Controle Declarativo).
   * Se definido, tem prioridade sobre o estado interno.
   */
  isLoading?: boolean;

  /**
   * Ícone à esquerda do texto.
   */
  leftIcon?: React.ReactNode;

  /**
   * Ícone à direita do texto.
   */
  rightIcon?: React.ReactNode;

  /**
   * Se true, ocupa 100% da largura do pai.
   */
  fullWidth?: boolean;
}
