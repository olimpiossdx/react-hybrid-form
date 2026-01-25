import * as React from 'react';

import { cn } from '../../utils/cn';

type TextVariant = 'body' | 'muted' | 'danger' | 'success' | 'caption';
type TextSize = 'sm' | 'md' | 'lg';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: TextVariant;
  size?: TextSize;
  align?: 'left' | 'center' | 'right';
}

const Text: React.FC<TextProps> = ({ as: Comp = 'p', variant = 'body', size = 'md', align = 'left', className, ...props }) => {
  const variantClass =
    variant === 'muted'
      ? 'text-gray-500 dark:text-gray-400'
      : variant === 'danger'
        ? 'text-red-600 dark:text-red-400'
        : variant === 'success'
          ? 'text-green-600 dark:text-green-400'
          : variant === 'caption'
            ? 'text-gray-400 text-xs'
            : 'text-gray-900 dark:text-gray-100';

  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base';

  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

  return <Comp className={cn(variantClass, sizeClass, alignClass, className)} {...props} />;
};
export default Text;
