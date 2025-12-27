import ModalInjectionExample from './modal-injection-example';
import showModal from '../../componentes/modal/hook';

const TabModal = () => {
  // 1. HEADLESS CONTROLLER: Gerencia o estado (isOpen, config)

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl min-h-[600px] border border-gray-200 dark:border-gray-700 transition-colors">
      <header className="mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">Sistema de Modais (Imperativo)</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Criação dinâmica de árvore React no DOM (<code>createRoot</code>) com suporte a temas.
        </p>
      </header>

      <ModalInjectionExample showModal={showModal} />
    </div>
  );
};

export default TabModal;
