import { type SVGProps } from 'react';

export interface SpinnerProps extends SVGProps<SVGSVGElement> {
  /**
   * Tamanho do spinner.
   * - 'sm': 16px (Botões pequenos)
   * - 'md': 24px (Padrão)
   * - 'lg': 48px (Destaque)
   * - 'xl': 64px (Tela cheia)
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Variante visual.
   * - 'border': Círculo com rastro (notch).
   */
  variant?: 'border';
}

export const Spinner = ({ size = 'md', variant = 'border', className, ...props }: SpinnerProps) => {
  // Mapa de tamanhos (Tailwind classes)
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${className || ''}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Carregando"
      {...props}>
      <span className="sr-only">Carregando...</span>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

Spinner.displayName = 'Spinner';
