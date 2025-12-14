import React, { useLayoutEffect, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  // Aceita qualquer tipo de Ref para flexibilidade (div, input, etc)
  triggerRef: React.RefObject<any>;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean; // Se true, força min-width igual ao trigger
}

const Popover: React.FC<PopoverProps> = ({
  isOpen,
  onClose,
  triggerRef,
  children,
  className = "",
  fullWidth = false,
}) => {
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    minWidth: number;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current && popoverRef.current && isOpen) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      // Posição Padrão: Baixo - Esquerda
      let top = triggerRect.bottom + scrollY + 4;
      let left = triggerRect.left + scrollX;

      // 1. Detecção de Colisão Vertical (Flip para cima se não couber embaixo)
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const popoverHeight = popoverRect.height;

      if (spaceBelow < popoverHeight && triggerRect.top > popoverHeight) {
        top = triggerRect.top + scrollY - popoverHeight - 4;
      }

      // 2. Detecção de Colisão Horizontal (Ajuste para esquerda)
      const popoverWidth = popoverRect.width;

      if (left + popoverWidth > viewportWidth) {
        // Tenta alinhar pela direita
        left = triggerRect.right + scrollX - popoverWidth;
        // Guarda de segurança
        if (left < 4) left = 4;
      }

      setCoords({
        top,
        left,
        minWidth: fullWidth ? triggerRect.width : 0,
      });
      setIsVisible(true);
    }
  };

  // useLayoutEffect: Roda antes da pintura para evitar FOUC (Flash of Unstyled Content)
  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    } else {
      setIsVisible(false);
      setCoords(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, { capture: true });
    }
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, { capture: true });
    };
  }, [isOpen]);

  // Click Outside
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={popoverRef}
      className={`
        absolute z-9999 rounded-lg shadow-2xl border
        transition-opacity duration-200 ease-out
        /* TEMA: Fundo Branco (Light) / Cinza (Dark) */
        bg-white dark:bg-gray-800 
        border-gray-200 dark:border-gray-700
        
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
        ${className}
      `}
      style={{
        top: coords?.top ?? 0,
        left: coords?.left ?? 0,
        minWidth:
          coords?.minWidth && coords.minWidth > 0 ? coords.minWidth : undefined,
        visibility: coords ? "visible" : "hidden", // Esconde enquanto calcula
      }}
    >
      {children}
    </div>,
    document.body
  );
};

export default Popover;
