import React, { useEffect, useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, Star, X } from 'lucide-react';

import { toastManager } from './manager';
import type { IToast, ToastPosition } from './types';

const ToastContainer = () => {
  const [toasts, setToasts] = useState<IToast[]>([]);

  useEffect(() => {
    return toastManager.subscribe(setToasts);
  }, []);

  const positions: ToastPosition[] = ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'];

  const getPositionClasses = (pos: ToastPosition) => {
    const fixed = 'fixed z-[9999] flex flex-col gap-3 p-4 pointer-events-none max-h-screen overflow-hidden';
    switch (pos) {
      case 'top-right':
        return `${fixed} top-0 right-0 items-end`;
      case 'top-left':
        return `${fixed} top-0 left-0 items-start`;
      case 'bottom-right':
        return `${fixed} bottom-0 right-0 items-end flex-col-reverse`;
      case 'bottom-left':
        return `${fixed} bottom-0 left-0 items-start flex-col-reverse`;
      case 'top-center':
        return `${fixed} top-0 left-1/2 -translate-x-1/2 items-center`;
      case 'bottom-center':
        return `${fixed} bottom-0 left-1/2 -translate-x-1/2 items-center flex-col-reverse`;
    }
  };

  return (
    <>
      {positions.map((pos) => (
        <div key={pos} className={getPositionClasses(pos)}>
          {toasts
            .filter((t) => (t.position || 'top-right') === pos)
            .map((toast) => (
              <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
      ))}
    </>
  );
};

const ToastItem = ({ toast }: { toast: IToast }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => toastManager.remove(toast.id), 300);
  };

  useEffect(() => {
    if (toast.duration !== Infinity) {
      const timer = setTimeout(handleClose, toast.duration || 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const icons = {
    success: <CheckCircle className="text-green-500 dark:text-green-400" size={24} />,
    error: <AlertCircle className="text-red-500 dark:text-red-400" size={24} />,
    warning: <AlertTriangle className="text-yellow-500 dark:text-yellow-400" size={24} />,
    info: <Info className="text-blue-500 dark:text-blue-400" size={24} />,
    custom: toast.icon || <Star className="text-purple-500 dark:text-purple-400" size={24} />,
  };

  // Cores da borda lateral (Identidade do Toast)
  const borderColors = {
    success: 'border-l-green-500 dark:border-l-green-400',
    error: 'border-l-red-500 dark:border-l-red-400',
    warning: 'border-l-yellow-500 dark:border-l-yellow-400',
    info: 'border-l-blue-500 dark:border-l-blue-400',
    custom: 'border-l-purple-500 dark:border-l-purple-400',
  };

  const isLarge = toast.size === 'large';

  return (
    <div
      className={`
        pointer-events-auto 
        ${isLarge ? 'w-96 p-6' : 'w-80 p-4'}
        border-l-4 rounded shadow-lg flex items-start gap-4
        transition-all duration-300 ease-in-out transform
        
        /* TEMA: Fundo Branco (Light) / Cinza (Dark) */
        bg-white dark:bg-gray-800 
        
        /* Borda sutil ao redor */
        border border-gray-200 dark:border-gray-700
        
        /* Borda Semântica Lateral */
        ${borderColors[toast.type]}
        
        ${isExiting ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100 animate-in fade-in slide-in-from-bottom-2'}
      `}
      role="alert">
      <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>

      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className={`font-bold text-gray-900 dark:text-white mb-1 ${isLarge ? 'text-lg' : 'text-sm'}`}>{toast.title}</h4>
        )}
        <p className={`text-gray-600 dark:text-gray-300 leading-relaxed ${isLarge ? 'text-base' : 'text-sm'}`}>{toast.message}</p>

        {toast.action && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.action?.onClick();
            }}
            className="mt-3 text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-3 py-1.5 rounded transition-colors uppercase tracking-wide">
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-white shrink-0 -mt-1 -mr-1 p-1 transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};

export default ToastContainer;
