import React from 'react';

export interface IModalProps {
  options: IModalOptions<any, any, any>;
  onClose: () => void; // Callback para destruir a árvore
};

// O manager lida com qualquer tipo de modal, então usamos generics default ou any
export type Listener = (options: IModalOptions<any, any, any> | null) => void;

// Tipo auxiliar para componentes que aceitam props
export type ModalComponentType<P = any> = React.ComponentType<P>;

/**
 * Interface Genérica para Configuração do Modal.
 */
export interface IModalOptions<H = any, C = any, A = any> {
  // SLOTS: Aceitam um Componente (Função) OU um Node (JSX pronto)
  
  title?: ModalComponentType<H> | React.ReactNode;
  content: ModalComponentType<C> | React.ReactNode;
  actions?: ModalComponentType<A> | React.ReactNode;
  footer?: ModalComponentType<A> | React.ReactNode; // Alias

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
  
  onClose?: () => void;
}

// O que a função retorna para controle externo
export interface IModalHandle {
  close: () => void;
}