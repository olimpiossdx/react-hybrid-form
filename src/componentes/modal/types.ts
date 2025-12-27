import React from 'react';

/**
 * Interface Genérica para Configuração do Modal.
 * @template H Tipo das props do Header
 * @template C Tipo das props do Content
 * @template A Tipo das props das Actions/Footer
 */
export interface IModalOptions<H = any, C = any, A = any> {
  // SLOTS: Aceitam um Componente (Função) OU um Node (JSX pronto)
  title?: ModalComponentType<H> | React.ReactNode;
  content: ModalComponentType<C> | React.ReactNode;
  actions?: ModalComponentType<A> | React.ReactNode;
  footer?: ModalComponentType<A> | React.ReactNode; // Alias para actions

  // PROPS INJETADAS
  props?: {
    title?: H;
    content?: C;
    actions?: A;
    footer?: A;
  };

  // CONFIGURAÇÃO
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'custom';
  closeOnBackdropClick?: boolean;
  styleConfig?: React.CSSProperties | any; // Flexibilidade para estilos inline

  // LIFECYCLE
  onClose?: () => void;
}

// Props do Componente Visual <Modal />
export interface IModalProps {
  options: IModalOptions<any, any, any>;
  onClose: () => void;
}

// Definição para o Manager (se usado)
export type Listener = (options: IModalOptions<any, any, any> | null) => void;

// Tipo auxiliar para componentes que aceitam props
export type ModalComponentType<P = any> = React.ComponentType<P>;

// O que a função showModal retorna
export interface IModalHandle {
  close: () => void;
}
