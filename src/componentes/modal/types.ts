import React from 'react';

// Define as props padrão injetadas automaticamente pelo sistema de modal
export interface InjectedModalProps {
  onClose: () => void;
}

/**
 * Tipo auxiliar para componentes que aceitam props.
 * Agora ele explicitamente diz que as props (P) serão unidas com InjectedModalProps (onClose).
 */
export type ModalComponentType<P = {} & any> = React.ComponentType<P & InjectedModalProps>;

/**
 * Interface Genérica para Configuração do Modal.
 * @template H Tipo das props do Header
 * @template C Tipo das props do Content
 * @template A Tipo das props das Actions/Footer
 */
export interface IModalOptions<H = {} & any, C = {} & any, A = {} & any> {
  // SLOTS: Aceitam um Componente (Função) OU um Node (JSX pronto)
  // Se for função, ela recebe as props definidas (H, C, A) + onClose
  title?: ModalComponentType<H> | React.ReactNode | string;
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
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' | 'custom';
  closeOnBackdropClick?: boolean;
  styleConfig?: React.CSSProperties | any;

  // LIFECYCLE
  onClose?: () => void;
}

// Props do Componente Visual <Modal />
export interface IModalProps {
  options: IModalOptions<any, any, any>;
  onClose: () => void;
}

// Definição para o Manager
export type Listener = (options: IModalOptions<any, any, any> | null) => void;
