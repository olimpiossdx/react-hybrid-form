import { useState, useCallback } from 'react';
import type { IModalOptions } from './types';

/**
 * Interface de retorno do showModal para permitir controle imperativo (ex: fechar após fetch).
 */
export interface IModalHandle {
  close: () => void;
}

export const useModal = () => {
  // Estado interno do modal
  const [isOpen, setIsOpen] = useState(false);

  // O estado do config precisa ser genérico (any) pois ele muda a cada chamada
  const [config, setConfig] = useState<IModalOptions<any, any, any> | null>(null);

  /**
   * Fecha o modal e limpa a configuração após um delay (animação).
   */
  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Limpa o config após a animação de saída (300ms) para evitar glitches visuais
    setTimeout(() => {
      setConfig(null);
    }, 300);
  }, []);

  /**
   * Abre o modal com tipagem forte (Generics).
   * O TypeScript inferirá H, C, A baseados nos componentes passados.
   */
  const showModal = useCallback(<H, C, A>(options: IModalOptions<H, C, A>): IModalHandle => {
    setConfig(options);
    setIsOpen(true);

    return { close: closeModal };
  }, [closeModal]);

  return {
    // Funções de Controle
    showModal,
    closeModal,

    // Props prontas para passar para o componente <Modal />
    // Uso: <Modal {...modalProps} />
    modalProps: {
      isOpen,
      config,
      onClose: closeModal
    }
  };
};

export default useModal;