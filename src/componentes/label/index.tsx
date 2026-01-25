// componentes/form/form-label.tsx
import React from 'react';

import { cn } from '../../utils/cn';

interface BaseLabelProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

export interface StaticLabelProps extends BaseLabelProps {
  variant?: 'default' | 'muted';
}

const StaticLabel: React.FC<StaticLabelProps> = ({ label, htmlFor, required, variant = 'default', className }) =>
  label ? (
    <label
      htmlFor={htmlFor}
      className={cn(
        'block text-sm font-medium',
        variant === 'muted' ? 'text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-100',
        className,
      )}>
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  ) : null;
export default StaticLabel;
