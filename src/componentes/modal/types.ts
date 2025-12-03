import React from 'react';

// Tipo auxiliar para componentes que aceitam props
export type ModalComponentType<P = any> = React.ComponentType<P>;

/**
 * Interface Genérica para Configuração do Modal.
 * * @template H - Tipo das props do Header/Title
 * @template C - Tipo das props do Content/Body
 * @template A - Tipo das props das Actions/Footer
 */
export interface IModalOptions<H = any, C = any, A = any> {
  // SLOTS: Aceitam um Componente (Função) OU um Node (JSX pronto)
  
  /** Componente para o título ou JSX direto */
  title?: ModalComponentType<H> | React.ReactNode;
  
  /** Componente principal do conteúdo ou JSX direto */
  content: ModalComponentType<C> | React.ReactNode;
  
  /** Componente de rodapé/ações ou JSX direto */
  actions?: ModalComponentType<A> | React.ReactNode;

  // PROPS: Objeto tipado que alimenta os componentes acima.
  // O TypeScript forçará que as chaves aqui combinem com as props dos componentes passados.
  props?: {
    title?: H;
    content?: C;
    actions?: A;
  };

  // CONFIGURAÇÃO GERAL
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdropClick?: boolean;
  
  // CALLBACKS
  onClose?: () => void;
}
// O que a função retorna para controle externo
export interface IModalHandle {
  close: () => void;
}