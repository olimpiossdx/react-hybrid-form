import React, { useEffect } from "react";
import { UserPlus, User, Briefcase, Layers, FileText } from "lucide-react";
import Autocomplete from "../../componentes/autocomplete";
import showModal from "../../componentes/modal/hook";
import useForm from "../../hooks/use-form";

// Estilos locais para feedback de erro (borda vermelha + mensagem)
// Atualizado com suporte a Dark Mode
const STYLES = `
  /* Input Texto Inválido */
  .form-input.is-touched:invalid {
    border-color: #ef4444 !important;
    background-color: #fef2f2;
  }
  
  html.dark .form-input.is-touched:invalid {
    background-color: rgba(127, 29, 29, 0.2); /* Red 900/20 */
    border-color: #f87171 !important; /* Red 400 */
  }

  /* Estilo para Radio/Checkbox inválidos */
  input[type="radio"].is-touched:invalid,
  input[type="checkbox"].is-touched:invalid {
    outline: 2px solid #ef4444;
    outline-offset: 2px;
  }

  /* Mensagem de Erro */
  .error-msg {
    color: #ef4444;
    font-size: 0.75rem;
    margin-top: 4px;
    font-weight: 500;
    min-height: 1.2em;
    opacity: 0;
    transition: opacity 0.2s;
  }

  html.dark .error-msg {
    color: #f87171; /* Red 400 */
  }
  
  /* Mostra erro quando o texto é injetado */
  .error-msg[data-visible="true"] {
    opacity: 1;
  }
`;

interface IModalOptions {
  title: string;
  content: () => React.ReactNode;
}

const CARGOS = [
  { value: "dev", label: "Desenvolvedor" },
  { value: "design", label: "Designer" },
  { value: "pm", label: "Product Manager" },
];

const RegistrationComplexExample = () => {
  const onSubmit = (data: any) => {
    showModal({
      title: "Cadastro Realizado!",
      size: "sm",
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
            <UserPlus size={24} />
            <span className="font-bold">Dados processados com sucesso.</span>
          </div>
          <pre className="text-xs bg-gray-100 dark:bg-black p-4 rounded border border-gray-200 dark:border-gray-700 overflow-auto text-gray-700 dark:text-gray-300">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ),
    });
  };

  const { formProps, setValidators } = useForm({
    id: "complex-reg-form",
    onSubmit,
  });

  // Regras de Validação
  useEffect(() => {
    setValidators({
      validarNome: (val: any) => {
        if (!val) return { message: "Nome é obrigatório.", type: "error" };
        if (String(val).split(" ").length < 2)
          return { message: "Digite sobrenome.", type: "error" };
      },
      validarGenero: (val: any) => {
        if (!val) return { message: "Selecione uma opção.", type: "error" };
      },
      validarSkills: (val: any) => {
        if (!val || (Array.isArray(val) && val.length < 2))
          return { message: "Selecione pelo menos 2 skills.", type: "error" };
      },
      validarCargo: (val: any) => {
        if (!val) return { message: "Cargo é obrigatório.", type: "error" };
      },
      validarTermos: (val: any) => {
        if (!val)
          return { message: "Você deve aceitar os termos.", type: "error" };
      },
    });
  }, [setValidators]);

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto transition-colors">
      <style>{STYLES}</style>

      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
          <UserPlus size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Cadastro Completo
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Validação mista: Inputs, Radios, Arrays e Autocomplete.
          </p>
        </div>
      </div>

      <form {...formProps} noValidate className="space-y-6">
        {/* 1. INPUT TEXTO */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">
            <User size={16} /> Nome Completo
          </label>
          <input
            type="text"
            name="nome"
            className="form-input"
            placeholder="Ex: Ana Silva"
            data-validation="validarNome"
          />
          <div id="error-nome" className="error-msg"></div>
        </div>

        {/* 2. RADIO GROUP */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
            <Briefcase size={16} /> Modalidade
          </label>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="modalidade"
                value="remoto"
                data-validation="validarGenero"
                className="w-4 h-4 text-cyan-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-cyan-500"
              />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Remoto
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="modalidade"
                value="hibrido"
                className="w-4 h-4 text-cyan-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-cyan-500"
              />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Híbrido
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="modalidade"
                value="presencial"
                className="w-4 h-4 text-cyan-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-cyan-500"
              />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Presencial
              </span>
            </label>
          </div>
          {/* Slot de erro ancorado no primeiro radio via data-validation */}
          <div id="error-modalidade" className="error-msg"></div>
        </div>

        {/* 3. AUTOCOMPLETE (Select Oculto) */}
        <div>
          <Autocomplete
            name="cargo"
            label="Cargo Pretendido"
            options={CARGOS}
            placeholder="Selecione..."
            validationKey="validarCargo"
            required
            className="mb-0" // Remove margem padrão para colar no erro
          />
          <div id="error-cargo" className="error-msg"></div>
        </div>

        {/* 4. CHECKBOX GROUP (Array) */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
            <Layers size={16} /> Conhecimentos (Mínimo 2)
          </label>

          {/* Mestre */}
          <label className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold mb-2 cursor-pointer w-fit p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
            <input
              type="checkbox"
              data-checkbox-master="skills"
              className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-cyan-600 focus:ring-cyan-500"
            />
            Todas as stacks
          </label>

          <div className="grid grid-cols-2 gap-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700 ml-1.5">
            {[
              "React",
              "Node.js",
              "TypeScript",
              "Python",
              "DevOps",
              "UI/UX",
            ].map((skill) => (
              <label
                key={skill}
                className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-white transition-colors"
              >
                <input
                  type="checkbox"
                  name="skills"
                  value={skill.toLowerCase()}
                  data-validation={
                    skill === "React" ? "validarSkills" : undefined
                  } // Validação no primeiro
                  className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-cyan-600 focus:ring-cyan-500"
                />
                {skill}
              </label>
            ))}
          </div>
          <div id="error-skills" className="error-msg"></div>
        </div>

        {/* 5. CHECKBOX SIMPLES (Boolean) */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
            <input
              type="checkbox"
              name="termos"
              className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-purple-600 focus:ring-purple-500"
              data-validation="validarTermos"
            />
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <FileText size={16} />
              <span>
                Li e concordo com os <strong>termos de serviço</strong>.
              </span>
            </div>
          </label>
          <div id="error-termos" className="error-msg pl-2"></div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-900/20 hover:scale-[1.02] transition-all active:scale-95"
        >
          Finalizar Cadastro
        </button>
      </form>
    </div>
  );
};

export default RegistrationComplexExample;
