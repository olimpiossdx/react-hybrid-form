import React from 'react';
import { Lock, LogIn, Mail } from 'lucide-react';

import showModal, { closeModal } from '../../componentes/modal/hook';
import useForm from '../../hooks/use-form';

interface LoginFormValues {
  email: string;
  pass: string;
}

const LoginForm = () => {
  const [loading, setLoading] = React.useState(false);

  const onSubmit = (data: LoginFormValues) => {
    setLoading(true);

    // Simula chamada de API
    setTimeout(() => {
      setLoading(false);

      // Abre modal de sucesso via API Imperativa
      showModal({
        title: 'Bem-vindo(a)!',
        size: 'sm',
        content: (
          <div className="space-y-3">
            <p className="text-gray-300">Login realizado com sucesso.</p>
            <p className="text-xs text-gray-500 font-mono">Payload: {JSON.stringify(data)}</p>
          </div>
        ),
        actions: (
          <div className="flex justify-end w-full">
            <button
              onClick={() => closeModal()}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded font-bold transition-colors">
              Acessar Painel
            </button>
          </div>
        ),
      });
    }, 1500);
  };

  // 1. Configuração do Hook (DX Simplificada)
  const { formProps } = useForm<LoginFormValues>({
    id: 'login-form-native',
    onSubmit,
  });

  return (
    <div className="max-w-sm mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 mb-3">
          <LogIn size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Acesso Nativo</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Validação HTML5 + useForm</p>
      </div>

      <form {...formProps} className="space-y-5">
        {/* Campo E-mail */}
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">E-mail</label>
          <div className="relative">
            <input
              name="email"
              type="email"
              className="form-input pl-8" // Padding left para o ícone
              placeholder="seu@email.com"
              required
            />
            {/* CORREÇÃO: z-20 para ficar acima do input e pointer-events-none para não bloquear o clique */}
            <Mail className="absolute left-2 top-2.5 text-gray-400 w-5 h-5 z-20 pointer-events-none" />
          </div>
        </div>

        {/* Campo Senha */}
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Senha</label>
          <div className="relative">
            <input name="pass" type="password" className="form-input pl-8" placeholder="••••••" required minLength={6} />
            {/* CORREÇÃO: z-20 para ficar acima do input */}
            <Lock className="absolute left-2 top-2.5 text-gray-400 w-5 h-5 z-20 pointer-events-none" />
          </div>
        </div>

        {/* Botão de Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-all flex justify-center items-center gap-2 mt-2 shadow-lg shadow-cyan-900/20">
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Entrando...
            </>
          ) : (
            'Entrar no Sistema'
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
