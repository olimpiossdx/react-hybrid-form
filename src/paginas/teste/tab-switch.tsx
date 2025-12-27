import React, { useState } from 'react';
import { Bell, Settings, ShieldCheck, ToggleLeft } from 'lucide-react';

import showModal from '../../componentes/modal/hook';
import Switch from '../../componentes/switch';
import useForm from '../../hooks/use-form';

const DADOS_API = {
  modo_escuro: true,
  notificacoes: true,
  email_extra: 'dev@empresa.com',
  termos: true,
  newsletter: false,
};

const SwitchExample: React.FC = () => {
  const onSubmit = (data: any) => {
    showModal({
      title: 'Preferências Salvas',
      size: 'sm',
      content: (
        <div className="space-y-3">
          <p className="text-gray-600 dark:text-gray-300 text-sm">Configurações atualizadas:</p>
          <pre className="text-xs bg-gray-100 dark:bg-black p-4 rounded text-green-600 dark:text-green-400 border border-gray-200 dark:border-gray-700">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ),
    });
  };

  const { formProps, resetSection } = useForm({
    id: 'switch-form',
    onSubmit,
  });

  // UI State
  const [showEmail, setShowEmail] = useState(false);
  const [mode, setMode] = useState<'novo' | 'editando'>('novo');

  const handleLoadData = () => {
    setMode('editando');
    setShowEmail(DADOS_API.notificacoes);
    setTimeout(() => resetSection('', DADOS_API), 50);
  };

  const handleReset = () => {
    setMode('novo');
    setShowEmail(false);
    setTimeout(() => resetSection('', null), 50);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
            <ToggleLeft size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Switch Toggle</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Controles booleanos com animação.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleLoadData}
            type="button"
            className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            Simular Edição
          </button>
          <button
            onClick={handleReset}
            type="button"
            className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Resetar
          </button>
        </div>
      </div>

      <form {...formProps}>
        {/* BLOCO 1 */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-4 flex items-center gap-2">
            <Settings size={14} /> Interface
          </h3>

          <Switch name="modo_escuro" label="Ativar Modo Escuro" defaultValue={false} />

          <Switch name="compacto" label="Modo Compacto (Small)" size="sm" className="mb-0" />
        </div>

        {/* BLOCO 2 */}
        <div
          className={`p-5 rounded-lg border transition-all duration-300 mb-6 ${showEmail ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-500/30' : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'}`}>
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-4 flex items-center gap-2">
            <Bell size={14} /> Notificações
          </h3>

          <Switch name="notificacoes" label="Receber alertas por e-mail" onChange={(checked) => setShowEmail(checked)} />

          {showEmail && (
            <div className="mt-4 pl-14 animate-in fade-in slide-in-from-top-2">
              <input
                name="email_extra"
                type="email"
                required={showEmail}
                placeholder="Digite seu e-mail principal..."
                className="form-input"
              />
            </div>
          )}
        </div>

        {/* BLOCO 3 */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-4 flex items-center gap-2">
            <ShieldCheck size={14} /> Legal
          </h3>

          <Switch name="termos" label="Li e aceito os termos de serviço" required className="mb-1" />
          <p className="text-[10px] text-gray-500 dark:text-gray-500 pl-14">* Tente salvar sem marcar para ver o balão de erro.</p>
        </div>

        <div className="flex justify-end border-t border-gray-100 dark:border-gray-700 pt-6">
          <button
            type="submit"
            className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95">
            Salvar Preferências
          </button>
        </div>
      </form>
    </div>
  );
};

export default SwitchExample;
