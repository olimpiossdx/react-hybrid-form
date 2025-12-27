import React from 'react';
import { AlertOctagon, Megaphone, ShieldCheck, Terminal } from 'lucide-react';

import Alert from '../../componentes/alert';
import useForm from '../../hooks/use-form';

const AlertExample: React.FC = () => {
  const { formProps, handleSubmit } = useForm('alert-form');
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [showInfo, setShowInfo] = React.useState(true);

  const onSubmit = () => {
    setServerError('Erro 500: Não foi possível conectar ao banco de dados.');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-5xl mx-auto transition-colors">
      <div className="mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Megaphone size={24} className="text-orange-500" />
          Alertas Contextuais
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Componentes de feedback estático que se adaptam ao tema.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* COLUNA 1: EXEMPLO INTERATIVO */}
        <div>
          <h3 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase mb-4 tracking-wider">1. Feedback de Aplicação</h3>

          <div className="space-y-4 mb-6 min-h-20">
            {showInfo && (
              <Alert variant="info" title="Dica de Preenchimento" onClose={() => setShowInfo(false)}>
                Preencha os dados com atenção para evitar retrabalho.
              </Alert>
            )}

            {serverError && (
              <Alert variant="error" title="Falha no Processamento" onClose={() => setServerError(null)}>
                {serverError}
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setServerError(null);
                      alert('Tentando...');
                    }}
                    className="text-xs font-bold bg-red-100 dark:bg-red-900/40 text-red-700
                     dark:text-red-100 px-3 py-1.5 rounded border border-red-200 dark:border-red-800 transition-colors hover:bg-red-200 dark:hover:bg-red-900/60"
                  >
                    Tentar Novamente
                  </button>
                </div>
              </Alert>
            )}
          </div>

          <form {...formProps} onSubmit={handleSubmit(onSubmit)} className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-6">
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">CEP</label>
              <input name="cep" className="form-input" placeholder="00000-000" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Cidade</label>
                <input name="cidade" className="form-input" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Estado</label>
                <input name="uf" className="form-input" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold shadow-lg transition-transform active:scale-95"
              >
                Simular Erro
              </button>
            </div>
          </form>
        </div>

        {/* COLUNA 2: GALERIA */}
        <div className="space-y-6 border-l border-gray-100 dark:border-gray-700 pl-0 lg:pl-10">
          <h3 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase mb-4 tracking-wider">2. Galeria de Variantes</h3>

          <Alert variant="success" title="Pagamento Aprovado">
            Sua transação <strong>#8493</strong> foi processada com sucesso.
          </Alert>

          <Alert variant="warning" title="Armazenamento Cheio">
            Você está usando 95% do seu espaço.{' '}
            <a href="#" className="underline font-medium hover:text-black dark:hover:text-white">
              Faça upgrade
            </a>
            .
          </Alert>

          <Alert variant="neutral" title="System Log" icon={<Terminal size={18} />} className="font-mono text-xs">
            [INFO] Server initialized.
            <br />
            [INFO] Database connected.
          </Alert>

          <Alert variant="error" title="Validação Falhou" icon={<AlertOctagon size={20} />}>
            <ul className="list-disc pl-4 mt-1 space-y-1 opacity-90">
              <li>Usuário já existe.</li>
              <li>Senha fraca.</li>
            </ul>
          </Alert>

          <Alert variant="success" icon={<ShieldCheck size={20} className="text-green-500 dark:text-green-400" />}>
            <div>
              <h4 className="font-bold text-green-700 dark:text-green-300">Ambiente Seguro</h4>
              <p className="text-xs mt-1">Conexão criptografada de ponta a ponta.</p>
            </div>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default AlertExample;
