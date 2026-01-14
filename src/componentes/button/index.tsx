import { type ButtonHTMLAttributes, forwardRef, type ReactNode, useImperativeHandle, useRef, useState } from 'react';

import { Spinner } from '../spinner';

// --- Interfaces ---

// O "Super Ref": É um botão HTML nativo + nossos métodos customizados
export interface ButtonElement extends HTMLButtonElement {
  setLoading: (loading: boolean) => void;
  loading: boolean;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Estilo visual do botão.
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';

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
  leftIcon?: ReactNode;

  /**
   * Ícone à direita do texto.
   */
  rightIcon?: ReactNode;

  /**
   * Se true, ocupa 100% da largura do pai.
   */
  fullWidth?: boolean;
}

// --- Componente ---

const Button = forwardRef<ButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading: propLoading,
      disabled,
      leftIcon,
      rightIcon,
      fullWidth = false,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    // Referência interna ao elemento DOM real
    const internalRef = useRef<HTMLButtonElement>(null);

    // Estado interno para controle imperativo (via ref.setLoading)
    const [internalLoading, setInternalLoading] = useState(false);

    // Estado Efetivo: Propriedade externa ganha se estiver definida, senão usa interno
    const isEffectiveLoading = propLoading !== undefined ? propLoading : internalLoading;

    // A mágica da Ref Híbrida:
    // Expõe o elemento DOM nativo MAS adiciona os métodos customizados nele
    useImperativeHandle(ref, () => {
      const element = internalRef.current;

      if (!element) {
        return null as unknown as ButtonElement;
      }

      // Usamos Object.assign ou definimos propriedades diretamente na instância do elemento
      // Isso permite que 'ref.current.focus()' continue funcionando nativamente
      const augmentedElement = element as ButtonElement;

      augmentedElement.setLoading = (val: boolean) => {
        setInternalLoading(val);
      };

      // Definimos um getter para 'loading' refletir o estado atual
      Object.defineProperty(augmentedElement, 'loading', {
        get: () => isEffectiveLoading,
        configurable: true, // Permite reconfiguração se necessário
      });

      return augmentedElement;
    }, [isEffectiveLoading]); // Recria o handle se o estado mudar

    // --- Estilização (Tailwind) ---

    const baseStyles =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 select-none';

    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm border border-transparent',
      secondary:
        'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 border border-transparent',
      outline:
        'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
      ghost: 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100 text-gray-600 dark:text-gray-400',
      destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
      link: 'text-blue-600 underline-offset-4 hover:underline',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2 text-sm', // Alinhado com Input md
      lg: 'h-12 px-8 text-base',
      icon: 'h-10 w-10',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={internalRef}
        type={type}
        className={`
          ${baseStyles} 
          ${variants[variant]} 
          ${sizes[size]} 
          ${widthClass} 
          ${className || ''}
        `}
        disabled={isEffectiveLoading || disabled}
        {...props}>
        {isEffectiveLoading ? (
          <>
            {/* Mantém a largura ou substitui conteúdo? 
                Geralmente substituir o ícone esquerdo é mais estável visualmente */}
            <Spinner size={size === 'sm' ? 'sm' : 'md'} className={`animate-spin ${children ? 'mr-2' : ''}`} />
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
