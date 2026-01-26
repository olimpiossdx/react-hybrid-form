import { useEffect } from 'react';
import { Lock, Mail, ShieldCheck } from 'lucide-react';

import Button from '../../componentes/button';
import Input from '../../componentes/input';
import { showModal } from '../../componentes/modal';
import useForm from '../../hooks/use-form';

const ValidationFeedbackExample = () => {
  const onSubmit = (_data: any) => {
    showModal({
      title: 'Sucesso!',
      size: 'sm',
      content: (
        <div className="flex flex-col items-center py-4 text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-3">
            <ShieldCheck size={24} />
          </div>
          <p className="text-gray-700 dark:text-gray-300">Login validado com sucesso.</p>
        </div>
      ),
    });
  };

  const { formProps, setValidators } = useForm({ id: 'smart-validation-form', onSubmit });

  // Restauramos a lógica de validação customizada (Business Logic)
  // O hook aplicará setCustomValidity internamente, o que disparará
  // o visual (Shake/Red) do nosso novo componente Input.
  useEffect(() => {
    setValidators({
      validarEmail: (val: string) => {
        if (!val) {
          return { message: 'O e-mail é obrigatório.', type: 'error' };
        }
        if (!val.includes('@')) {
          return { message: "Falta o '@'.", type: 'error' };
        }
        if (val.length < 5) {
          return { message: 'E-mail muito curto.', type: 'error' };
        }
      },
      validarSenha: (val: string) => {
        if (!val) {
          return { message: 'Senha necessária.', type: 'error' };
        }
        if (val.length < 6) {
          return { message: 'Mínimo 6 caracteres.', type: 'error' };
        }
        if (!/[A-Z]/.test(val)) {
          return { message: 'Falta uma letra maiúscula.', type: 'error' };
        }
      },
    });
  }, [setValidators]);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Login Inteligente</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Componente Novo + Lógica Customizada.</p>
      </div>

      {/* O Input recebe as props do formProps, mas também pode receber props manuais */}
      <form {...formProps} noValidate={false} className="space-y-6">
        {/* Campo E-mail */}
        {/* Note como passamos data-validation: o componente Input repassa isso para o input HTML interno */}
        <Input
          label="E-MAIL"
          name="email"
          type="email"
          placeholder="seu@email.com"
          // Propriedade customizada lida pelo seu Hook
          data-validation="validarEmail"
          // Ícone usando a prop padronizada do componente
          leftIcon={<Mail size={20} />}
          required
        />

        {/* Campo Senha */}
        <Input
          label="SENHA"
          name="senha"
          type="password"
          placeholder="••••••"
          data-validation="validarSenha"
          leftIcon={<Lock size={20} />}
          required
        />

        <Button type="submit" variant="primary" className="w-full justify-center py-2.5 font-bold shadow-lg shadow-cyan-900/20">
          Entrar
        </Button>
      </form>
    </div>
  );
};
export default ValidationFeedbackExample;
