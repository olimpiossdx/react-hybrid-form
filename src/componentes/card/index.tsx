import { forwardRef, type HTMLAttributes } from 'react';

// --- Interfaces ---

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Estilo visual do card.
   * - 'elevated': Sombra suave, fundo branco (Padrão).
   * - 'outlined': Sem sombra, borda visível.
   * - 'ghost': Transparente, sem borda (para alinhamento).
   */
  variant?: 'elevated' | 'outlined' | 'ghost';
}

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;
export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type CardContentProps = HTMLAttributes<HTMLDivElement>;
export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

// --- Componentes ---

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, variant = 'elevated', ...props }, ref) => {
  const variantClasses = {
    elevated: 'bg-white dark:bg-gray-800 shadow-sm border border-transparent',
    outlined: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-none',
    ghost: 'bg-transparent border-none shadow-none',
  };

  return (
    <div ref={ref} className={`rounded-xl text-gray-900 dark:text-gray-100 ${variantClasses[variant]} ${className || ''}`} {...props} />
  );
});
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className || ''}`} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLParagraphElement, CardTitleProps>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={`font-semibold leading-none tracking-tight text-lg ${className || ''}`} {...props} />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(({ className, ...props }, ref) => (
  <p ref={ref} className={`text-sm text-gray-500 dark:text-gray-400 ${className || ''}`} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className || ''}`} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={`flex items-center p-6 pt-0 ${className || ''}`} {...props} />
));
CardFooter.displayName = 'CardFooter';

// --- Exports ---

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
