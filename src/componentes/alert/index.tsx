import React, { memo } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

import type { ValidationSeverity } from '../../utils/validate';

export type AlertVariant = ValidationSeverity | 'neutral';

export interface IAlertProps {
  variant?: AlertVariant;
  title?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const variants = {
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
    iconColor: 'text-blue-500 dark:text-blue-400',
    DefaultIcon: Info,
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
    iconColor: 'text-green-500 dark:text-green-400',
    DefaultIcon: CheckCircle,
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
    iconColor: 'text-yellow-500 dark:text-yellow-400',
    DefaultIcon: AlertTriangle,
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
    iconColor: 'text-red-500 dark:text-red-400',
    DefaultIcon: AlertCircle,
  },
  neutral: {
    container: 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300',
    iconColor: 'text-gray-500 dark:text-gray-400',
    DefaultIcon: Info,
  },
};

/**
 * Componente de Alerta Contextual.
 * Suporta temas (Light/Dark) e variantes semânticas.
 */
const Alert: React.FC<IAlertProps> = memo(({ variant = 'neutral', title, children, icon, onClose, className = '' }) => {
  const style = variants[variant];
  const IconComp = style.DefaultIcon;

  return (
    <div
      role="alert"
      className={`
        flex items-start gap-3 p-4 rounded-lg border-l-4 border 
        animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm
        ${style.container} 
        ${className}
      `}>
      <div className={`shrink-0 mt-0.5 ${style.iconColor}`}>{icon || <IconComp size={20} />}</div>

      <div className="flex-1 min-w-0">
        {title && <h5 className="font-bold mb-1 leading-tight">{title}</h5>}
        <div className="text-sm opacity-90 leading-relaxed">{children}</div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className={`
            shrink-0 -mt-1 -mr-1 p-1.5 rounded-md transition-colors
            hover:bg-black/5 dark:hover:bg-white/10
            ${style.iconColor}
          `}
          aria-label="Fechar alerta">
          <X size={16} />
        </button>
      )}
    </div>
  );
});

export default Alert;
