import React from "react";
import { showModal } from "../../componentes/modal";
import StarRating from "../../componentes/start-rating";
import useForm from "../../hooks/use-form";
import {
  pipe,
  required,
  minLength,
  isEmail,
  equalsTo,
  when,
} from "../../utils/validate";

const TabValidationComplexExample = () => {
  // ... setup onSubmit ...
  const onSubmit = (data: any) => {
    showModal({
      title: "Dados Válidos!",
      content: JSON.stringify(data, null, 2),
    });
  };

  const { formProps, setValidators } = useForm({
    id: "complex-validation",
    onSubmit,
  });

  React.useEffect(() => {
    // USO DA NOVA SINTAXE LIMPA
    setValidators({
      // Simples e Composto
      nome: pipe(required(), minLength(3)),

      // Formato
      email: pipe(required(), isEmail()),

      // Cruzada (Senha vs Confirmação)
      senha: pipe(required(), minLength(6)),
      confirmarSenha: pipe(
        required(),
        equalsTo("senha", "As senhas devem ser iguais")
      ),

      // Condicional (Cruzada Lógica)
      cnpj: when(
        (values) => values.temEmpresa === true,
        required("CNPJ é obrigatório para empresas")
      ),

      // --- NOVA REGRA DE NEGÓCIO (Rating vs Comentário) ---
      rating: required("Selecione uma nota"),

      comentario: pipe(
        // Cenário A: Nota Baixa (1 ou 2 estrelas)
        // Regra: Obrigatório E Mínimo 10 caracteres (Justificativa forte)
        when(
          (values) => Number(values.rating) > 0 && Number(values.rating) < 3,
          pipe(
            required("Para notas baixas, o comentário é obrigatório."),
            minLength(10, "Explique melhor o motivo (mínimo 10 letras).")
          )
        ),

        // Cenário B: Nota Alta (3, 4 ou 5 estrelas)
        // Regra: Opcional, mas se escrever, Mínimo 5 caracteres
        when(
          (values) => Number(values.rating) >= 3,
          minLength(5, "O comentário é curto demais.")
        )
      ),
    });
  }, [setValidators]);

  return (
    <form
      {...formProps}
      className="space-y-6 p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700"
    >
      <div className="border-b border-gray-700 pb-4 mb-4">
        <h3 className="text-xl font-bold text-white">
          Cadastro com Regras Dinâmicas
        </h3>
        <p className="text-xs text-gray-400">
          Exemplo de validação condicional e cruzada.
        </p>
      </div>

      {/* BLOCO 1: DADOS BÁSICOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">
            Nome
          </label>
          <input
            name="nome"
            data-validation="nome"
            className="form-input mt-1"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">
            Email
          </label>
          <input
            name="email"
            data-validation="email"
            className="form-input mt-1"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">
            Senha
          </label>
          <input
            name="senha"
            data-validation="senha"
            type="password"
            className="form-input mt-1"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">
            Confirmar
          </label>
          <input
            name="confirmarSenha"
            data-validation="confirmarSenha"
            type="password"
            className="form-input mt-1"
          />
        </div>
      </div>

      {/* BLOCO 2: CONDICIONAL SIMPLES */}
      <div className="bg-gray-900/50 p-4 rounded border border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <input
            name="temEmpresa"
            type="checkbox"
            className="accent-cyan-500 w-4 h-4"
          />
          <label className="text-sm text-gray-300">
            Represento uma Empresa
          </label>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">
            CNPJ (Se marcado acima)
          </label>
          <input
            name="cnpj"
            data-validation="cnpj"
            className="form-input mt-1"
            placeholder="00.000.000/0000-00"
          />
        </div>
      </div>

      {/* BLOCO 3: CONDICIONAL COMPLEXA (Rating) */}
      <div className="bg-gray-900/50 p-4 rounded border border-gray-700">
        <h4 className="text-sm font-bold text-cyan-400 mb-4 uppercase">
          Pesquisa de Satisfação
        </h4>

        <div className="mb-4">
          <StarRating
            name="rating"
            label="Sua Nota"
            required
            validationKey="rating"
            className="mb-0"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">
            Comentário
          </label>
          <textarea
            name="comentario"
            data-validation="comentario"
            className="form-input mt-1 h-24 resize-none"
            placeholder="Conte-nos mais..."
          />
          <p className="text-[10px] text-gray-500 mt-1">
            * Nota 1-2: Obrigatório (min 10 chars).
            <br />* Nota 3-5: Opcional (min 5 chars se preenchido).
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-8 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded shadow-lg transition-transform active:scale-95"
        >
          Validar Tudo
        </button>
      </div>
    </form>
  );
};

export default TabValidationComplexExample;
