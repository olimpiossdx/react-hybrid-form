import React, { useEffect } from "react";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import showModal from "../../componentes/modal/hook";
import useForm from "../../hooks/use-form";

// CSS Local Ajustado para Temas e Autofill
const STYLES = `
  /* Animação de Shake */
  @keyframes shake { 
    0%, 100% { transform: translateX(0); } 
    25% { transform: translateX(-4px); } 
    75% { transform: translateX(4px); } 
  }

  /* ESTADO DE ERRO (Light Mode) */
  .form-input[aria-invalid="true"] {
    border-color: #ef4444 !important; /* Red 500 */
    background-color: #fef2f2;        /* Red 50 (Claro) */
    animation: shake 0.3s ease-in-out;
  }
  
  /* ESTADO DE ERRO (Dark Mode) 
     Usamos 'html.dark' para garantir especificidade e detectar o tema
  */
  html.dark .form-input[aria-invalid="true"] {
    background-color: rgba(127, 29, 29, 0.2) !important; /* Red 900 com transparência */
    border-color: #f87171 !important; /* Red 400 (Mais claro para contraste) */
    color: #fecaca; /* Texto avermelhado claro */
  }
  
  /* Slot de Mensagem */
  .error-slot {
    color: #ef4444; 
    font-size: 0.75rem; 
    margin-top: 0.25rem; 
    font-weight: 500; 
    min-height: 1.2em;
    opacity: 0; 
    transform: translateY(-5px); 
    transition: all 0.2s ease-out;
  }

  /* Ajuste da cor do texto de erro no Dark Mode */
  html.dark .error-slot {
    color: #f87171; /* Red 400 */
  }

  .error-slot[data-visible="true"] { 
    opacity: 1; 
    transform: translateY(0); 
  }

  /* --- FIX PARA AUTOFILL (Chrome/Edge) EM DARK MODE --- */
  /* Remove o fundo branco forçado pelo navegador ao autocompletar */
  html.dark input:-webkit-autofill,
  html.dark input:-webkit-autofill:hover, 
  html.dark input:-webkit-autofill:focus, 
  html.dark input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px rgba(31, 41, 55, 1) inset !important; /* bg-gray-800 */
      -webkit-text-fill-color: white !important;
      caret-color: white !important;
      transition: background-color 5000s ease-in-out 0s; /* Atrasa a mudança de cor nativa */
  }
`;

const ValidationFeedbackExample = () => {
  const onSubmit = (_data: any) => {
    showModal({
      title: "Sucesso!",
      size: "sm",
      content: (
        <div className="flex flex-col items-center py-4 text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-3">
            <ShieldCheck size={24} />
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            Login validado com sucesso.
          </p>
        </div>
      ),
    });
  };

  const { formProps, setValidators } = useForm({
    id: "smart-validation-form",
    onSubmit,
  });

  useEffect(() => {
    setValidators({
      validarEmail: (val: string) => {
        if (!val) return { message: "O e-mail é obrigatório.", type: "error" };
        if (!val.includes("@"))
          return { message: "Falta o '@'.", type: "error" };
        if (val.length < 5)
          return { message: "E-mail muito curto.", type: "error" };
      },
      validarSenha: (val: string) => {
        if (!val) return { message: "Senha necessária.", type: "error" };
        if (val.length < 6)
          return { message: "Mínimo 6 caracteres.", type: "error" };
        if (!/[A-Z]/.test(val))
          return { message: "Falta uma letra maiúscula.", type: "error" };
      },
    });
  }, [setValidators]);

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md mx-auto transition-colors">
      <style>{STYLES}</style>

      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Login Inteligente
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Teste de UX: Digite errado, saia (Blur). O feedback visual se adapta
          ao tema.
        </p>
      </div>

      <form {...formProps} noValidate>
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
            E-mail
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              className="form-input pl-10"
              placeholder="seu@email.com"
              data-validation="validarEmail"
            />
            <Mail className="absolute left-3 top-2.5 text-gray-400 w-5 h-5 z-20 pointer-events-none" />
          </div>
          <div id="error-email" className="error-slot"></div>
        </div>

        <div className="mb-8">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
            Senha
          </label>
          <div className="relative">
            <input
              type="password"
              name="senha"
              className="form-input pl-10"
              placeholder="••••••"
              data-validation="validarSenha"
            />
            <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5 z-20 pointer-events-none" />
          </div>
          <div id="error-senha" className="error-slot"></div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-lg shadow-cyan-900/20 hover:scale-[1.02] transition-all active:scale-95"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default ValidationFeedbackExample;
