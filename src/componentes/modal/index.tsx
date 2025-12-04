import React, { useEffect, useRef, useState } from 'react';
import type { IModalOptions } from './types';

interface ModalProps {
  options: IModalOptions<any, any, any>;
  onClose: () => void; // Callback para destruir a árvore
}

const Modal: React.FC<ModalProps> = ({ options, onClose }) => {
  // Controlamos isOpen aqui para garantir a animação de entrada e saída
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // 1. Animação de Entrada (Mount)
  useEffect(() => {
    // Pequeno delay para permitir que o CSS processe a transição de opacidade
    requestAnimationFrame(() => setIsOpen(true));
  }, []);

  // 2. Lógica de Fechamento com Animação
  const handleClose = () => {
    setIsOpen(false);
    // Aguarda a animação (300ms) antes de desmontar a árvore React
    setTimeout(() => {
      if (options.onClose) options.onClose(); // Callback do usuário
      onClose(); // Callback do sistema (Destruir DOM)
    }, 300);
  };

  // 3. Lock Scroll & Teclado
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && handleClose();
    window.addEventListener('keydown', handleEsc);

    return () => {
      // Só destrava o scroll se não houver outros modais abertos
      // (Verifica se ainda existe outro container de modal no body)
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

  // --- RENDER SLOT HELPER ---
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

  // Nota: Não usamos createPortal aqui. O container pai já está no body.
  return (
    <div
      ref={overlayRef}
      // data-hybrid-modal serve para contarmos quantos modais estão abertos
      data-hybrid-modal="true"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full flex flex-col transition-all duration-300 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'} ${sizeClasses[options.size || 'md']}`}
        style={options.styleConfig}
        onClick={(e) => e.stopPropagation()}
      >
        {options.title && (
          <div className="flex justify-between items-start p-6 border-b border-gray-700">
            <div className="text-xl font-bold text-cyan-400 flex-1">
              {renderSlot(options.title, options.props?.title)}
            </div>
            <button onClick={handleClose} className="text-gray-500 hover:text-white transition-colors text-2xl leading-none ml-4">&times;</button>
          </div>
        )}

        <div className="p-6 overflow-y-auto max-h-[70vh] text-gray-300 scrollbar-thin scrollbar-thumb-gray-600">
          {renderSlot(options.content, options.props?.content)}
        </div>

        {(options.actions || options.footer) && (
          <div className="p-4 border-t border-gray-700 bg-gray-900/30 rounded-b-xl">
            {renderSlot(options.actions || options.footer, options.props?.actions || options.props?.footer)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;