import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { IModalOptions } from './types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Usamos 'any' aqui pois o Modal não precisa saber os tipos específicos do conteúdo em runtime,
  // apenas o TypeScript no momento da chamada precisa saber.
  config: IModalOptions<any, any, any> | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, config }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // 1. Lock Scroll & Esc Listener
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !config) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current && config.closeOnBackdropClick !== false) {
      onClose();
    }
  };

  // --- HELPER DE RENDERIZAÇÃO (SMART RENDER) ---
  // Decide se renderiza Componente Injetado ou JSX Puro
  const renderSlot = (Slot: any, slotProps: any) => {
    if (!Slot) return null;

    // Se for um Componente (Função/Classe), instancia com as props + onClose
    // isValidElement checka se é JSX (<Div />), typeof function checka se é referência (MyComponent)
    if (typeof Slot === 'function' && !React.isValidElement(Slot)) {
      const Component = Slot;
      return <Component {...slotProps} onClose={onClose} />;
    }

    // Se for JSX direto, retorna como está
    return Slot;
  };

  // Classes de tamanho
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full m-4'
  };
  const maxWidthClass = sizeClasses[config.size || 'md'];

  // Renderiza via Portal no Body
  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full ${maxWidthClass} flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        {config.title && (
          <div className="flex justify-between items-start p-6 border-b border-gray-700">
            <div className="flex-1">
              {renderSlot(config.title, config.props?.title)}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors text-2xl leading-none ml-4"
              aria-label="Fechar"
            >
              &times;
            </button>
          </div>
        )}

        {/* BODY */}
        <div className="p-6 overflow-y-auto text-gray-300 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {renderSlot(config.content, config.props?.content)}
        </div>

        {/* FOOTER */}
        {config.actions && (
          <div className="p-4 border-t border-gray-700 bg-gray-900/30 rounded-b-xl">
            {renderSlot(config.actions, config.props?.actions)}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;