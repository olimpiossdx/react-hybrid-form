import React from 'react';

import type { IModalProps } from './types';

const Modal: React.FC<IModalProps> = ({ options, onClose }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);
  // Guarda quem estava focado antes do modal abrir para devolver depois
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  // 1. Animação de Entrada e Captura de Foco Inicial
  React.useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;

    requestAnimationFrame(() => {
      setIsOpen(true);
      // Foca no modal container ou no primeiro input assim que abrir
      if (modalRef.current) {
        modalRef.current.focus();
      }
    });
  }, []);

  // 2. Lógica de Fechamento com Animação e Devolução de Foco
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      if (options.onClose) {
        options.onClose();
      }
      onClose(); // Destrói o nó DOM

      // Devolve o foco para o botão que abriu este modal
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }, 300);
  };

  // 3. Focus Trap (Prender o TAB dentro do modal)
  React.useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) {
        return;
      }

      const focusableElements = modalRef.current.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      // Shift + Tab: Se estiver no primeiro, vai pro último
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      }
      // Tab: Se estiver no último, vai pro primeiro
      else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
      if (e.key === 'Tab') {
        handleTabKey(e);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      // Só libera o scroll se for o último modal da pilha
      const otherModals = document.querySelectorAll('[data-hybrid-modal]');
      if (otherModals.length <= 1) {
        document.body.style.overflow = '';
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current && options.closeOnBackdropClick !== false) {
      handleClose();
    }
  };

  // Utilitário para renderizar Slots
  const renderSlot = (Slot: any, props?: any) => {
    if (!Slot) {
      return null;
    }
    if (React.isValidElement(Slot)) {
      return React.cloneElement(Slot as React.ReactElement, props);
    }
    if (typeof Slot === 'function') {
      return <Slot {...props} />;
    }
    return Slot;
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-full m-4 h-[calc(100%-2rem)]',
    custom: '',
  };

  // ID único para acessibilidade
  const titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      ref={overlayRef}
      data-hybrid-modal="true"
      className={`fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
        isOpen ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'
      }`}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={options.title ? titleId : undefined}>
      <div
        ref={modalRef}
        tabIndex={-1} // Permite focar na div programaticamente
        className={`
            relative w-full flex flex-col max-h-full outline-none transition-all duration-300 transform 
            ${isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'} 
            ${sizeClasses[options.size || 'md']}
            bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700 
            shadow-2xl rounded-xl
        `}
        style={options.styleConfig}
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        {options.title && (
          <div className="flex justify-between items-start p-6 border-b border-gray-100 dark:border-gray-700 shrink-0">
            <div id={titleId} className="text-xl font-bold text-gray-900 dark:text-cyan-400 flex-1">
              {renderSlot(options.title, options.props?.title)}
            </div>
            <button
              onClick={handleClose}
              aria-label="Fechar modal"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors text-2xl leading-none ml-4 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
              &times;
            </button>
          </div>
        )}

        {/* Content (Scrollable) */}
        <div className="p-6 overflow-y-auto min-h-0 text-gray-600 dark:text-gray-300 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {renderSlot(options.content, options.props?.content)}
        </div>

        {/* Footer / Actions */}
        {(options.actions || options.footer) && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl shrink-0 flex justify-end gap-2">
            {renderSlot(options.actions || options.footer, options.props?.actions)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
