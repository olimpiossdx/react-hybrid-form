import { type HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Variante semântica de cor.
   * - 'default': Cinza/Neutro (Padrão)
   * - 'success': Verde (Ativo, Concluído)
   * - 'warning': Amarelo/Laranja (Pendente, Alerta)
   * - 'error': Vermelho (Cancelado, Falha)
   * - 'info': Azul (Em progresso)
   */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';

  /**
   * Tamanho do badge.
   * - 'sm': Texto menor, padding reduzido (Ideal para tabelas).
   * - 'md': Padrão.
   */
  size?: 'sm' | 'md';

  /**
   * Estilo visual.
   * - 'solid': Fundo sólido forte, texto branco.
   * - 'soft': Fundo suave, texto colorido (Padrão Moderno).
   * - 'outline': Borda colorida, fundo transparente.
   */
  appearance?: 'solid' | 'soft' | 'outline';

  /**
   * Define o formato da borda.
   * - 'pill': Totalmente arredondado (rounded-full).
   * - 'square': Cantos levemente arredondados (rounded-md).
   */
  shape?: 'pill' | 'square';
}

const Badge = ({ variant = 'default', size = 'md', appearance = 'soft', shape = 'pill', className, children, ...props }: BadgeProps) => {
  // Mapa de Cores Base (Tailwind)
  const colors = {
    default: {
      soft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      solid: 'bg-gray-600 text-white dark:bg-gray-700',
      outline: 'text-gray-600 border border-gray-300 dark:text-gray-400 dark:border-gray-600',
    },
    success: {
      soft: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      solid: 'bg-green-600 text-white',
      outline: 'text-green-600 border border-green-600/30 dark:text-green-400 dark:border-green-500/30',
    },
    warning: {
      soft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      solid: 'bg-yellow-500 text-white',
      outline: 'text-yellow-600 border border-yellow-600/30 dark:text-yellow-400 dark:border-yellow-500/30',
    },
    error: {
      soft: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      solid: 'bg-red-600 text-white',
      outline: 'text-red-600 border border-red-600/30 dark:text-red-400 dark:border-red-500/30',
    },
    info: {
      soft: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      solid: 'bg-blue-600 text-white',
      outline: 'text-blue-600 border border-blue-600/30 dark:text-blue-400 dark:border-blue-500/30',
    },
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
  };

  const shapeClasses = {
    pill: 'rounded-full',
    square: 'rounded-md',
  };

  const variantClass = colors[variant][appearance];
  const sizeClass = sizeClasses[size];
  const shapeClass = shapeClasses[shape];

  return (
    <span className={`inline-flex items-center font-medium ${variantClass} ${sizeClass} ${shapeClass} ${className || ''}`} {...props}>
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
export default Badge;
