import { createRoot } from 'react-dom/client';
import type { IModalOptions } from './types';
import Modal from './index';

// Pilha de modais ativos para gerenciar o fechamento global (LIFO)
const activeModals: { close: () => void }[] = [];

/**
 * Fecha o último modal aberto na pilha.
 */
export const closeModal = () => {
  const lastModal = activeModals[activeModals.length - 1];
  if (lastModal) {
    lastModal.close();
  }
};

/**
 * Função Imperativa para abrir modais.
 * Cria um novo nó React no DOM para cada chamada, permitindo empilhamento.
 */
const showModal = <H, C, A>(options: IModalOptions<H, C, A>) => {
  // 1. Cria o container físico no DOM
  const container = document.createElement('div');
  // Adiciona identificador para debug, mas permite múltiplos
  container.classList.add('hybrid-modal-host');
  document.body.appendChild(container);

  // 2. Cria a raiz React isolada
  const root = createRoot(container);

  // Função interna de limpeza (Animação -> Unmount -> Remove DOM)
  const destroy = () => {
    // 1. Renderiza fechado para disparar animação de saída no Modal
    root.render(
      <Modal
        options={options}
        onClose={() => { }}
      />
    );

    // 2. Aguarda a animação terminar e limpa tudo
    setTimeout(() => {
      // Remove da pilha global
      const index = activeModals.findIndex(m => m.close === destroy);
      if (index !== -1) activeModals.splice(index, 1);

      // Desmonta React e remove Elemento
      root.unmount();
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }, 300); // Tempo sincronizado com a transição CSS do Modal
  };

  // Handler que será passado para o componente
  const handleClose = () => {
    // Chama callback do usuário se existir
    if (options.onClose) options.onClose();
    destroy();
  };

  // Adiciona à pilha para que closeModal() global funcione
  activeModals.push({ close: handleClose });

  // 3. Renderiza Inicial (Aberto)
  root.render(
    <Modal
      options={options}
      onClose={handleClose}
    />
  );

  // Retorna controle para quem chamou
  return { close: handleClose };
};

export default showModal;