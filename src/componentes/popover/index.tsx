import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<any>; 
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const Popover: React.FC<PopoverProps> = ({ 
  isOpen, 
  onClose, 
  triggerRef, 
  children, 
  className = "",
  fullWidth = false 
}) => {
  // Começamos com coords, mas só renderizamos quando calculado
  const [coords, setCoords] = useState<{ top: number; left: number; minWidth: number } | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current && isOpen) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      setCoords({
        top: rect.bottom + scrollY + 4,
        left: rect.left + scrollX,
        minWidth: fullWidth ? rect.width : 0
      });
    }
  };

  // --- CORREÇÃO CRÍTICA: useLayoutEffect ---
  // Roda sincronamente APÓS as mutações do DOM mas ANTES do browser pintar a tela.
  // Isso evita que o usuário veja o popover em (0,0) antes de ir para o lugar certo.
  useLayoutEffect(() => {
    if (isOpen) {
        updatePosition();
    }
  }, [isOpen]);

  // Listeners de resize/scroll continuam no useEffect normal (passivos)
  useEffect(() => {
    if (isOpen) {
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, { capture: true });
    }
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, { capture: true });
    };
  }, [isOpen]);

  // Clique fora
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current?.contains(e.target as Node) || 
        triggerRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Se não está aberto OU se ainda não calculou a posição inicial, não renderiza nada.
  // Isso garante que o primeiro frame já seja na posição correta.
  if (!isOpen || !coords) return null;

  return createPortal(
    <div
      ref={popoverRef}
      className={`
        fixed z-9999 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl 
        animate-in fade-in zoom-in-95 duration-200
        ${className}
      `}
      style={{
        top: coords.top,
        left: coords.left,
        minWidth: coords.minWidth > 0 ? coords.minWidth : undefined
      }}
    >
      {children}
    </div>,
    document.body
  );
};

export default Popover;