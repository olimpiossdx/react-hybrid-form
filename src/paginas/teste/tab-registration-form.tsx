import React from 'react';
import { User, Mail, Lock, ShieldCheck, UserPlus } from 'lucide-react';
import showModal, { closeModal } from '../../componentes/modal/hook';
import useForm from '../../hooks/use-form';
import type { FormField } from '../../hooks/use-form/props';

interface RegistrationFormValues {
  name: string;
  email: string;
  pass: string;
  confirmPass: string;
}

const RegistrationForm = () => {
  const [loading, setLoading] = React.useState(false);

  const onSubmit = (data: RegistrationFormValues) => {
    setLoading(true);

    // Simula API
    setTimeout(() => {
      setLoading(false);

      showModal({
        title: "Conta Criada!",
        size: 'sm',
        content: (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
               <ShieldCheck size={32} />
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Seja bem-vindo, <strong>{data.name}</strong>.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Um e-mail de confirmação foi enviado para {data.email}.
            </p>
          </div>
        ),
        actions: (
            <div className="flex justify-center w-full">
                <button 
                    onClick={() => closeModal()} 
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-lg"
                >
                    Ir para Login
                </button>
            </div>
        )
      });
    }, 1500);
  };

  const { formProps, setValidators } = useForm<RegistrationFormValues>({
    id: "registration-form-native",
    onSubmit
  });

  // Validação Cruzada (Senha vs Confirmação)
  React.useEffect(() => {
      setValidators({
          validarSenha: (val: string) => {
             if (val.length < 6) return { message: "Mínimo de 6 caracteres", type: "error" };
          },
          validarConfirmacao: (val: string, _field: FormField | null, formValues: RegistrationFormValues) => {
             if (val !== formValues.pass) return { message: "As senhas não coincidem", type: "error" };
          }
      });
  }, [setValidators]);

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-3">
            <UserPlus size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nova Conta</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Crie seu acesso para continuar</p>
      </div>

      <form {...formProps} className="space-y-5">
        
        {/* Nome */}
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Nome Completo</label>
          <div className="relative">
             <input 
                name="name" 
                type="text" 
                className="form-input pl-10" 
                placeholder="Seu nome" 
                required 
             />
             <User className="absolute left-3 top-2.5 text-gray-400 w-5 h-5 z-20 pointer-events-none" />
          </div>
        </div>

        {/* E-mail */}
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">E-mail</label>
          <div className="relative">
             <input 
                name="email" 
                type="email" 
                className="form-input pl-10" 
                placeholder="seu@email.com" 
                required 
             />
             <Mail className="absolute left-3 top-2.5 text-gray-400 w-5 h-5 z-20 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Senha */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Senha</label>
              <div className="relative">
                <input 
                    name="pass" 
                    type="password" 
                    className="form-input pl-10" 
                    placeholder="••••••" 
                    required 
                    data-validation="validarSenha"
                />
                <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5 z-20 pointer-events-none" />
              </div>
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Confirmar</label>
              <div className="relative">
                <input 
                    name="confirmPass" 
                    type="password" 
                    className="form-input pl-10" 
                    placeholder="••••••" 
                    required 
                    data-validation="validarConfirmacao"
                />
                <ShieldCheck className="absolute left-3 top-2.5 text-gray-400 w-5 h-5 z-20 pointer-events-none" />
              </div>
            </div>
        </div>

        <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-all flex justify-center items-center gap-2 mt-4 shadow-lg shadow-purple-900/20"
        >
            {loading ? "Criando Conta..." : "Cadastrar"}
        </button>

      </form>
    </div>
  );
};

export default RegistrationForm;