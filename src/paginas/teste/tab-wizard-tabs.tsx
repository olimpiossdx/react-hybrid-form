import React from 'react';
import { CheckCircle, MapPin, ShieldCheck, User } from 'lucide-react';

import { showModal } from '../../componentes/modal';
import { Tabs } from '../../componentes/tab';
import { toast } from '../../componentes/toast';
import useForm from '../../hooks/use-form';

const TabWizard = () => {
  const onSubmit = (data: any) => {
    showModal({
      title: 'Wizard Finalizado',
      size: 'sm',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold">
            <ShieldCheck size={20} />
            <span>Todos os passos validados com sucesso.</span>
          </div>
          <pre
            className="text-xs bg-gray-100 dark:bg-black p-4 text-green-600 dark:text-green-400 
          rounded border border-gray-200 dark:border-gray-700 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ),
    });
  };

  // 1. Hook com validação
  const { formProps, validateScope, setValidators } = useForm({
    id: 'wizard-form',
    onSubmit,
  });

  React.useEffect(() => {
    setValidators({
      nome: (val: string) => (!val ? { message: 'Nome obrigatório', type: 'error' } : undefined),
      email: (val: string) => (!val.includes('@') ? { message: 'Email inválido', type: 'error' } : undefined),
      cidade: (val: string) => (!val ? { message: 'Cidade obrigatória', type: 'error' } : undefined),
      termos: (val: boolean) => (!val ? { message: 'Aceite os termos', type: 'error' } : undefined),
    });
  }, [setValidators]);

  // 2. A Lógica de Bloqueio (Middleware de Navegação)
  const handleBeforeChange = (next: string, current: string, currentPanel: HTMLElement | null) => {
    // Se estiver voltando (ex: step2 -> step1), permite sempre
    if (next < current) {
      return true;
    }

    // Se estiver avançando, valida o escopo atual
    if (currentPanel) {
      const isValid = validateScope(currentPanel);
      if (!isValid) {
        toast.warning('Preencha os campos obrigatórios antes de avançar.');
        return false; // Bloqueia a troca
      }
    }
    return true; // Permite
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border 
    border-gray-200 dark:border-gray-700 max-w-2xl mx-auto transition-colors">
      <div className="mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Wizard com Validação</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Tente avançar sem preencher os campos. O sistema bloqueia a navegação.</p>
      </div>

      <form {...formProps} className="min-h-[350px] flex flex-col">
        <Tabs.Root defaultValue="step1" beforeChange={handleBeforeChange} className="flex-1 flex flex-col">
          <Tabs.List className="mb-6">
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

          <div className="flex-1 relative">
            {/* STEP 1 */}
            <Tabs.Content value="step1" className="space-y-5 py-2 animate-in slide-in-from-right-4 fade-in">
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Nome Completo</label>
                <input name="nome" className="form-input" data-validation="nome" autoFocus />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Email Corporativo</label>
                <input name="email" className="form-input" data-validation="email" placeholder="nome@empresa.com" />
              </div>
            </Tabs.Content>

            {/* STEP 2 */}
            <Tabs.Content value="step2" className="space-y-5 py-2 animate-in slide-in-from-right-4 fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Cidade</label>
                  <input name="cidade" className="form-input" data-validation="cidade" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Estado</label>
                  <input name="estado" className="form-input" placeholder="UF" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Logradouro</label>
                <input name="rua" className="form-input" />
              </div>
            </Tabs.Content>

            {/* STEP 3 */}
            <Tabs.Content value="step3" className="space-y-6 py-8 text-center animate-in zoom-in-95 fade-in">
              <div className="inline-flex p-4 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400 mb-2">
                <CheckCircle size={48} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tudo Pronto!</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm max-w-xs mx-auto">
                  Revise seus dados. Ao clicar em finalizar, o formulário completo será enviado.
                </p>
              </div>

              <label
                className="flex items-center justify-center gap-2 
              cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <input
                  type="checkbox"
                  name="termos"
                  className="rounded border-gray-300 dark:border-gray-600 text-cyan-600 focus:ring-cyan-500"
                  data-validation="termos"
                />
                Li e aceito os termos de uso
              </label>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-green-600 hover:bg-green-700
                   text-white rounded-lg font-bold shadow-lg transition-transform active:scale-95 w-full sm:w-auto">
                  Finalizar Cadastro
                </button>
              </div>
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </form>
    </div>
  );
};

export default TabWizard;
