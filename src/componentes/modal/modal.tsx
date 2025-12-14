import React from 'react';
import type { IModalProps } from './types';

const Modal: React.FC<IModalProps> = ({ options, onClose }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  // 1. Animação de Entrada (Mount)
  React.useEffect(() => {
    requestAnimationFrame(() => setIsOpen(true));
  }, []);

  // 2. Lógica de Fechamento com Animação
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      if (options.onClose) options.onClose();
      onClose(); // Destrói o nó DOM
    }, 300);
  };

  // 3. Lock Scroll & Teclado
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && handleClose();
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      const otherModals = document.querySelectorAll('[data-hybrid-modal]');
      if (otherModals.length <= 1) {
          document.body.style.overflow = '';
      }
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current && options.closeOnBackdropClick !== false) {
      handleClose();
    }
  };

  const renderSlot = (Slot: any, slotProps: any = {}) => {
    if (!Slot) return null;
    if (typeof Slot === 'function' && !React.isValidElement(Slot)) {
      const Component = Slot;
      return <Component {...slotProps} onClose={handleClose} />;
    }
    return Slot;
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] h-[90vh]',
    custom: ''
  };

  return (
    <div 
      ref={overlayRef}
      data-hybrid-modal="true"
      className={`
        fixed inset-0 z-9999 flex items-center justify-center transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0'}
        bg-black/50 backdrop-blur-sm dark:bg-black/70
      `}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className={`
            w-full flex flex-col transition-all duration-300 transform 
            ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'} 
            ${sizeClasses[options.size || 'md']}
            bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700 
            shadow-2xl rounded-xl
        `}
        style={options.styleConfig}
        onClick={(e) => e.stopPropagation()}
      >
        {options.title && (
            <div className="flex justify-between items-start p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="text-xl font-bold text-gray-900 dark:text-cyan-400 flex-1">
                   {renderSlot(options.title, options.props?.title)}
                </div>
                <button 
                    onClick={handleClose} 
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors text-2xl leading-none ml-4"
                >
                    &times;
                </button>
            </div>
        )}

        <div className="p-6 overflow-y-auto max-h-[70vh] text-gray-600 dark:text-gray-300 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {renderSlot(options.content, options.props?.content)}
        </div>

        {(options.actions || options.footer) && (
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 rounded-b-xl">
                 {renderSlot(options.actions || options.footer, options.props?.actions || options.props?.footer)}
            </div>
        )}
      </div>
    </div>
  );
};

export default Modal;