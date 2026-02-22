import React from 'react';
import { X } from 'lucide-react';

import type { IModalProps } from './types';
import Button from '../button';

// ============================================================================
// 1. SUB-COMPONENTES (COMPOUND API) - DESIGN SYSTEM (CARD STYLE)
// ============================================================================

export const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  // Adicionado 'pr-8' para garantir que textos longos não fiquem por baixo do botão de fechar
  <div className={`flex flex-col space-y-1.5 p-2 pr-8 ${className || ''}`} {...props} />
);

export const ModalTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`font-semibold leading-none tracking-tight text-lg text-gray-900 dark:text-gray-100 ${className || ''}`} {...props} />
);

// ... (resto dos sub-componentes ModalDescription, ModalContent, ModalFooter permanecem iguais)
export const ModalDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm text-gray-500 dark:text-gray-400 ${className || ''}`} {...props} />
);

export const ModalContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-2 pt-0 ${className || ''}`} {...props} />
);

export const ModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex items-center justify-end p-2 gap-2 ${className || ''}`} {...props} />
);

const Modal: React.FC<IModalProps> = ({ options, onClose }) => {
  // ... (Hooks e React.useEffects permanecem iguais até o return)
  const [isOpen, setIsOpen] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);
  const titleId = React.useRef(`modal-title-${Math.random().toString(36).substr(2, 9)}`).current;

  React.useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    requestAnimationFrame(() => {
      setIsOpen(true);
      if (modalRef.current) {
        modalRef.current.focus();
      }
    });
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      if (options.onClose) {
        options.onClose();
      }
      onClose();
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }, 300);
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const allModals = document.querySelectorAll('[data-hybrid-modal="true"]');
      const isTopModal = allModals.length > 0 && allModals[allModals.length - 1] === overlayRef.current;
      if (!isTopModal) {
        return;
      }

      if (event.key === 'Escape') {
        event.stopPropagation();
        handleClose();
      }

      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      const otherModals = document.querySelectorAll('[data-hybrid-modal="true"]');
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

  const renderSlot = (Slot: any, props?: any) => {
    if (!Slot) {
      return null;
    }
    if (typeof Slot === 'function') {
      return <Slot {...props} onClose={handleClose} />;
    }
    if (React.isValidElement(Slot)) {
      return React.cloneElement(Slot as React.ReactElement, { onClose: handleClose, ...props });
    }
    return Slot;
  };

  const sizeClasses: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    full: 'max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]',
    custom: '',
  };

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
        tabIndex={-1}
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
        {/* Botão Fechar (X) - Posicionamento ajustado para right-1 top-1 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="absolute right-1 top-1 h-5 px-0 rounded-full opacity-70 hover:opacity-100 z-50"
          title="Fechar">
          <X size={20} className="text-gray-500 dark:text-gray-400" />
        </Button>

        {options.title && (
          <ModalHeader>
            {typeof options.title === 'string' ? <ModalTitle>{options.title}</ModalTitle> : renderSlot(options.title, options.props?.title)}
          </ModalHeader>
        )}

        {options.title || options.footer || options.actions ? (
          <ModalContent>{renderSlot(options.content, options.props?.content)}</ModalContent>
        ) : (
          renderSlot(options.content, options.props?.content)
        )}

        {(options.footer || options.actions) && (
          <ModalFooter>{renderSlot(options.footer || options.actions, options.props?.footer || options.props?.actions)}</ModalFooter>
        )}
      </div>
    </div>
  );
};

export default Modal;
