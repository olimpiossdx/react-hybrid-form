import React from 'react';
import { User, MapPin, CheckCircle } from 'lucide-react';
import { showModal } from '../../componentes/modal';
import { Tabs } from '../../componentes/tab';
import useForm from '../../hooks/use-form';

const TabWizardTabsExample = () => {

  const onSubmit = (data: any) => {
    showModal({
      title: "Wizard Finalizado",
      size: 'sm',
      content: <pre className="text-xs bg-black p-4 text-green-400 rounded">{JSON.stringify(data, null, 2)}</pre>
    });
  };

  // 1. Hook com validação
  const { formProps, validateScope, setValidators } = useForm({
    id: "wizard-form",
    onSubmit
  });

  React.useEffect(() => {
    setValidators({
      nome: (val: string) => !val ? { message: "Nome obrigatório", type: "error" } : undefined,
      email: (val: string) => !val.includes('@') ? { message: "Email inválido", type: "error" } : undefined,
      cidade: (val: string) => !val ? { message: "Cidade obrigatória", type: "error" } : undefined
    });
  }, [setValidators]);

  // 2. A Lógica de Bloqueio (Middleware de Navegação)
  const handleBeforeChange = (next: string, current: string, currentPanel: HTMLElement | null) => {
    console.log(`Tentando ir de ${current} para ${next}`);

    // Se tiver painel (sempre deve ter), valida apenas os campos dentro dele
    if (currentPanel) {
      const isValid = validateScope(currentPanel);
      if (!isValid) {
        // O validateScope já foca no erro e mostra o balão/texto
        return false; // Bloqueia a troca
      }
    }
    return true; // Permite
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto transition-colors">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Wizard com Validação</h2>

      <form {...formProps} className="min-h-[300px]">
        <Tabs.Root defaultValue="step1" beforeChange={handleBeforeChange}>
          <Tabs.List>
            <Tabs.Trigger value="step1" className="flex gap-2 items-center">
              <User size={16} /> Pessoal
            </Tabs.Trigger>
            <Tabs.Trigger value="step2" className="flex gap-2 items-center">
              <MapPin size={16} /> Endereço
            </Tabs.Trigger>
            <Tabs.Trigger value="step3" className="flex gap-2 items-center">
              <CheckCircle size={16} /> Revisão
            </Tabs.Trigger>
          </Tabs.List>

          {/* STEP 1 */}
          <Tabs.Content value="step1" className="space-y-4 py-4">
            <p className="text-sm text-gray-500">Preencha seus dados básicos.</p>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Nome</label>
              <input name="nome" className="form-input" data-validation="nome" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
              <input name="email" className="form-input" data-validation="email" />
            </div>
          </Tabs.Content>

          {/* STEP 2 */}
          <Tabs.Content value="step2" className="space-y-4 py-4">
            <p className="text-sm text-gray-500">Onde você mora?</p>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Cidade</label>
              <input name="cidade" className="form-input" data-validation="cidade" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Estado</label>
              <input name="estado" className="form-input" />
            </div>
          </Tabs.Content>

          {/* STEP 3 */}
          <Tabs.Content value="step3" className="space-y-4 py-4 text-center">
            <div className="inline-flex p-4 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 mb-4">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tudo Pronto!</h3>
            <p className="text-gray-500">Clique abaixo para enviar os dados.</p>

            <div className="mt-6">
              <button type="submit" className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold shadow-lg">
                Finalizar Cadastro
              </button>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </form>
    </div>);
};

export default TabWizardTabsExample;