import React, { useEffect } from "react";
import useForm from "../../hooks/use-form";
import showModal from "../../componentes/modal/hook";

// CSS local
const STYLES = `
  .form-input[aria-invalid="true"] {
    border-color: #ef4444 !important;
    animation: shake 0.3s ease-in-out;
  }
  .error-slot {
    color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; font-weight: 500; min-height: 1.2em;
    opacity: 0; transform: translateY(-5px); transition: all 0.2s ease-out;
  }
  .error-slot[data-visible="true"] { opacity: 1; transform: translateY(0); }
  @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
`;

const ValidationFeedbackExample = () => {
    
    const onSubmit = (_: any) => {
        showModal({ title: "Sucesso!", content: () => <div className="text-green-400">Login validado.</div> });
    };

    // DX: Passamos config
    const { formProps, setValidators } = useForm({ 
        id: "smart-validation-form",
        onSubmit
    });

    useEffect(() => {
        setValidators({
            validarEmail: (val: string) => {
                if (!val) return { message: "O e-mail é obrigatório.", type: "error" };
                if (!val.includes('@')) return { message: "Falta o '@'.", type: "error" };
                if (val.length < 5) return { message: "E-mail muito curto.", type: "error" };
            },
            validarSenha: (val: string) => {
                if (!val) return { message: "Senha necessária.", type: "error" };
                if (val.length < 6) return { message: "Mínimo 6 caracteres.", type: "error" };
                if (!/[A-Z]/.test(val)) return { message: "Falta uma letra maiúscula.", type: "error" };
            }
        });
    }, [setValidators]);

    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700 max-w-md mx-auto">
            <style>{STYLES}</style>
            <div className="mb-8 text-center">
                <h2 className="text-xl font-bold text-white mb-1">Login Inteligente</h2>
                <p className="text-xs text-gray-400">Teste: Digite errado, saia, depois corrija.</p>
            </div>

            {/* DX: Spread Props */}
            <form {...formProps} noValidate>
                <div className="mb-6">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-mail</label>
                    <input type="email" name="email" className="form-input w-full bg-gray-900 border-2 border-gray-600 rounded-lg p-2 text-white focus:border-cyan-500 outline-none" placeholder="seu@email.com" data-validation="validarEmail" />
                    <div id="error-email" className="error-slot"></div>
                </div>

                <div className="mb-8">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha</label>
                    <input type="password" name="senha" className="form-input w-full bg-gray-900 border-2 border-gray-600 rounded-lg p-2 text-white focus:border-cyan-500 outline-none" placeholder="••••••" data-validation="validarSenha" />
                    <div id="error-senha" className="error-slot"></div>
                </div>

                <button type="submit" className="w-full py-2.5 rounded-lg bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-lg hover:scale-[1.02] transition-transform active:scale-95">Entrar</button>
            </form>
        </div>
    );
};

export default ValidationFeedbackExample;