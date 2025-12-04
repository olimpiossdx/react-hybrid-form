
import showModal from "../../componentes/modal/hook";
import ModalInjectionExample from "./modal-injection-example";

const TabModal = () => {
  // 1. HEADLESS CONTROLLER: Gerencia o estado (isOpen, config)

  return (<div className="p-6 bg-gray-800 text-white rounded-lg shadow-xl min-h-[600px]">
    <header className="mb-8 border-b border-gray-700 pb-4">
      <h2 className="text-2xl font-bold text-cyan-400">Sistema de Modais (Portal + Slots)</h2>
      <p className="text-gray-400 mt-1">
        Arquitetura baseada em <code>useModal</code> e Injeção de Dependência Tipada.
      </p>
    </header>

    {/* 2. EXEMPLO COMPLETO: Passamos a função de controle para o cenário */}
    <ModalInjectionExample showModal={showModal} />
  </div>);
};

export default TabModal;