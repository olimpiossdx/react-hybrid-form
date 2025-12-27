import React, { useState } from 'react';
import { CheckSquare, Download, RotateCcw, Save, X } from 'lucide-react';

import showModal from '../../componentes/modal/hook';
import useForm from '../../hooks/use-form';
import type { FormField } from '../../hooks/use-form/props';

// Estrutura de dados do formulário
interface IFormValues {
  aceite: boolean;
  plano: string | boolean;
  interesses: string[];
  tarefas: string[];
  motivo_cancelamento?: string;
}

// MOCK: Dados que viriam de uma API para edição
const DADOS_API: IFormValues = {
  aceite: true,
  plano: 'premium',
  interesses: ['backend', 'cancelamento'],
  tarefas: ['setup'],
  motivo_cancelamento: 'Mudança de Stack Tecnológica',
};

const CheckboxGroupForm = () => {
  const onSubmit = (data: IFormValues) => {
    showModal({
      title: 'Dados Recebidos',
      size: 'sm',
      content: (
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-300 text-sm">JSON processado pelo useForm:</p>
          <pre className="text-xs bg-gray-100 dark:bg-black p-4 rounded text-green-600 dark:text-green-400 overflow-auto border border-gray-200 dark:border-gray-700">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ),
    });
  };

  // DX: Configuração unificada no hook
  const { formProps, setValidators, resetSection } = useForm<IFormValues>({
    id: 'checkbox-group-form',
    onSubmit,
  });

  const [mode, setMode] = useState<'novo' | 'editando'>('novo');
  const [isCancelando, setIsCancelando] = useState(false);
  // State apenas para demonstração visual da lista dinâmica (o useList gerencia a estrutura real)
  const [tarefasExtras, setTarefasExtras] = useState<number[]>([]);

  React.useEffect(() => {
    setValidators({
      validarInteresses: (values: any) => {
        if (!values || (Array.isArray(values) && values.length === 0)) {
          return { message: 'Selecione ao menos uma área.', type: 'error' };
        }
        if (Array.isArray(values) && values.length > 3) {
          return { message: 'Escolha no máximo 3 focos.', type: 'warning' };
        }
      },
      validarMotivo: (valor: any, _: FormField | null, formValues: IFormValues) => {
        const temCancelamento = formValues.interesses?.includes('cancelamento');
        if (temCancelamento && !valor) {
          return {
            message: 'Por favor, nos diga o motivo da saída.',
            type: 'error',
          };
        }
      },
    });
  }, [setValidators]);

  const handleLoadData = () => {
    setMode('editando');

    // Sincronia Explícita: Atualiza estado React (Ilhas de Reatividade)
    const deveMostrarCancelamento = DADOS_API.interesses.includes('cancelamento');
    setIsCancelando(deveMostrarCancelamento);

    // Sincronia DOM: Injeta valores nos inputs
    setTimeout(() => resetSection('', DADOS_API), 50);
  };

  const handleCancel = () => {
    if (mode === 'novo') {
      resetSection('', null);
      setIsCancelando(false);
    } else {
      // Reverte para o estado da API
      const estavaCancelando = DADOS_API.interesses.includes('cancelamento');
      setIsCancelando(estavaCancelando);
      setTimeout(() => resetSection('', DADOS_API), 50);
    }
  };

  const handleCancelamentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCancelando(e.target.checked);
  };

  const handleClickSairEdicao = () => {
    setMode('novo');
    resetSection('', null);
    setIsCancelando(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-cyan-400 flex items-center gap-2">
            <CheckSquare className="w-6 h-6" />
            {mode === 'novo' ? 'Novo Cadastro' : 'Editando Registro'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Teste de Checkbox Groups, Masters e Lógica Condicional.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleLoadData}
            disabled={mode === 'editando'}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <Download size={14} /> Simular API
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <RotateCcw size={14} /> {mode === 'novo' ? 'Limpar' : 'Desfazer'}
          </button>

          {/* Botão para Sair do Modo Edição */}
          {mode === 'editando' && (
            <button
              type="button"
              onClick={handleClickSairEdicao}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded border border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
              <X size={14} /> Sair
            </button>
          )}
        </div>
      </div>

      <form {...formProps} className="grid md:grid-cols-2 gap-8 animate-in fade-in zoom-in duration-300">
        {/* BLOCO 1 */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 pb-1">
            1. Unitários (Boolean)
          </h3>

          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded border border-gray-200 dark:border-gray-700 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="aceite"
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-cyan-600 dark:group-hover:text-white transition-colors">
                Li e aceito os termos
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="plano"
                value="premium"
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-green-600 focus:ring-green-500"
              />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-white transition-colors">
                Upgrade para Premium
              </span>
            </label>
          </div>
        </div>

        {/* BLOCO 2 */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 pb-1">
            2. Grupo & Reatividade
          </h3>

          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded border border-gray-200 dark:border-gray-700">
            <div className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
              <label className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold cursor-pointer w-fit select-none hover:opacity-80">
                <input
                  type="checkbox"
                  data-checkbox-master="interesses"
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-cyan-600 focus:ring-cyan-500"
                />
                Selecionar Todos
              </label>
            </div>

            <div className="space-y-2 pl-1">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-white cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="interesses"
                  value="frontend"
                  data-validation="validarInteresses"
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-cyan-600 focus:ring-cyan-500"
                />
                Frontend
              </label>
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-white cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="interesses"
                  value="backend"
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-cyan-600 focus:ring-cyan-500"
                />
                Backend
              </label>

              <label className="flex items-center gap-2 text-gray-400 dark:text-gray-500 cursor-not-allowed">
                <input
                  type="checkbox"
                  name="interesses"
                  value="fullstack"
                  disabled
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-400"
                />
                Full Stack (Disabled)
              </label>

              {/* GATILHO REATIVO */}
              <label
                className={`flex items-center gap-2 font-medium p-2 rounded transition-colors cursor-pointer ${isCancelando ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-200' : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <input
                  type="checkbox"
                  name="interesses"
                  value="cancelamento"
                  onChange={handleCancelamentoChange}
                  className="w-4 h-4 rounded border-yellow-500 bg-white dark:bg-gray-700 text-yellow-500 focus:ring-yellow-500"
                />
                Quero Cancelar Conta
              </label>

              {/* ILHA DE REATIVIDADE */}
              {isCancelando && (
                <div className="mt-2 pl-6 animate-in slide-in-from-top-2 fade-in duration-300">
                  <label className="text-xs text-yellow-600 dark:text-yellow-500 block mb-1 font-bold">Motivo Obrigatório:</label>
                  <input
                    type="text"
                    name="motivo_cancelamento"
                    data-validation="validarMotivo"
                    placeholder="Por que você está saindo?"
                    className="form-input border-yellow-300 dark:border-yellow-700 focus:border-yellow-500 dark:focus:border-yellow-500 focus:ring-yellow-500/30"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BLOCO 3: Dinâmico */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 pb-1 flex justify-between items-center">
            3. Lista Dinâmica (Observer)
            <button
              type="button"
              onClick={() => setTarefasExtras((p) => [...p, Date.now()])}
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded text-xs lowercase border border-gray-300 dark:border-gray-600 transition-colors">
              + add item
            </button>
          </h3>
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded border border-gray-200 dark:border-gray-700">
            <label className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold mb-3 cursor-pointer w-fit hover:opacity-80">
              <input
                type="checkbox"
                data-checkbox-master="tarefas"
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-purple-600 focus:ring-purple-500"
              />
              Marcar Concluídas
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="tarefas"
                  value="setup"
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-purple-600 focus:ring-purple-500"
                />
                Setup Inicial
              </label>
              {tarefasExtras.map((id, idx) => (
                <label
                  key={id}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 animate-in zoom-in fade-in hover:text-purple-600 dark:hover:text-white cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="tarefas"
                    value={`task_${id}`}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-purple-600 focus:ring-purple-500"
                  />
                  Extra #{idx + 1}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700 gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 py-2.5 px-8 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg active:scale-95 transition-all">
            <Save size={18} />
            {mode === 'novo' ? 'Salvar Registro' : 'Atualizar Dados'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckboxGroupForm;
