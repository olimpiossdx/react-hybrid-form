import React, { useEffect, useRef, useState } from 'react';

import type { IModalProps } from './types';

const Modal: React.FC<IModalProps> = ({ options, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Guarda o elemento que tinha foco antes do modal abrir
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // ID único para o título (Acessibilidade)
  const titleId = useRef(`modal-title-${Math.random().toString(36).substr(2, 9)}`).current;

  // 1. Ciclo de Vida e Animação
  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Pequeno delay para permitir a renderização antes da animação
    requestAnimationFrame(() => {
      setIsOpen(true);
      // Foca no container do modal para iniciar a navegação por teclado
      if (modalRef.current) {
        modalRef.current.focus();
      }
    });
  }, []);

  // 2. Fechamento Suave
  const handleClose = () => {
    setIsOpen(false); // Dispara animação de saída
    setTimeout(() => {
      if (options.onClose) {
        options.onClose();
      }
      onClose(); // Destrói o componente

      // Restaura o foco para o botão que abriu o modal
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }, 300); // Tempo da transição CSS
  };

  // 3. Gestão de Foco e Teclado (A11y + Stack)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Verifica se este é o modal do topo (último renderizado no DOM com este atributo)
      // Isso impede que um ESC feche todos os modais da pilha de uma vez
      const allModals = document.querySelectorAll('[data-hybrid-modal="true"]');
      const isTopModal = allModals.length > 0 && allModals[allModals.length - 1] === overlayRef.current;

      if (!isTopModal) {
        return;
      }

      if (e.key === 'Escape') {
        e.stopPropagation(); // Impede que o evento suba
        handleClose();
      }

      if (e.key === 'Tab' && modalRef.current) {
        // Focus Trap Lógica
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          // Shift + Tab (Trás)
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab (Frente)
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      // Só liberta o scroll se não houver outros modais
      const otherModals = document.querySelectorAll('[data-hybrid-modal="true"]');
      if (otherModals.length <= 1) {
        // <= 1 porque este ainda está no DOM neste momento
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

  // Utilitário para renderizar slots (Componentes ou Nós)
  const renderSlot = (Slot: any, props?: any) => {
    if (!Slot) {
      return null;
    }
    // Se for um componente React válido (função/classe), renderiza com props injetadas
    if (typeof Slot === 'function') {
      // Injeta onClose automaticamente para não precisar de 'any' ou tipagem manual no uso
      return <Slot {...props} onClose={handleClose} />;
    }
    // Se for elemento estático (JSX), clona e injeta props se possível, ou retorna direto
    if (React.isValidElement(Slot)) {
      return React.cloneElement(Slot as React.ReactElement, { onClose: handleClose, ...props });
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

  return (
    <div
      ref={overlayRef}
      data-hybrid-modal="true" // Marcador para gestão de pilha
      className={`fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
        isOpen ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'
      }`}
      onClick={handleBackdropClick}
      // Atributos A11y Essenciais
      aria-modal="true"
      role="dialog"
      aria-labelledby={options.title ? titleId : undefined}>
      <div
        ref={modalRef}
        tabIndex={-1} // Permite focar na div programaticamente (Focus Trap inicial)
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
            <div id={titleId} className="text-xl font-bold text-gray-900 dark:text-white flex-1">
              {renderSlot(options.title, options.props?.title)}
            </div>
            <button
              onClick={handleClose}
              aria-label="Fechar"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-2xl leading-none ml-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              &times;
            </button>
          </div>
        )}

        {/* Content */}
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
