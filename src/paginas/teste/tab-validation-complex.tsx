import React from 'react';
import { Building2, Lock, Mail, MessageSquare, ShieldCheck, Star, User } from 'lucide-react';

import { showModal } from '../../componentes/modal';
import StarRating from '../../componentes/start-rating';
import useForm from '../../hooks/use-form';
import useMask from '../../hooks/use-mask';
import { equalsTo, isEmail, minLength, pipe, required, when } from '../../utils/validate';

const TabValidationComplexExample = () => {
  const cnpjMask = useMask('cnpj');

  // ... setup onSubmit ...
  const onSubmit = (data: any) => {
    showModal({
      title: 'Dados Válidos!',
      content: JSON.stringify(data, null, 2),
    });
  };

  const { formProps, setValidators } = useForm({
    id: 'complex-validation',
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
      confirmarSenha: pipe(required(), equalsTo('senha', 'As senhas devem ser iguais')),

      // Condicional (Cruzada Lógica)
      cnpj: when((values) => values.temEmpresa, required('CNPJ é obrigatório para empresas')),

      // --- NOVA REGRA DE NEGÓCIO (Rating vs Comentário) ---
      rating: required('Selecione uma nota'),

      comentario: pipe(
        // Cenário A: Nota Baixa (1 ou 2 estrelas)
        // Regra: Obrigatório E Mínimo 10 caracteres (Justificativa forte)
        when(
          (values) => Number(values.rating) > 0 && Number(values.rating) < 3,
          pipe(required('Para notas baixas, o comentário é obrigatório.'), minLength(10, 'Explique melhor o motivo (mínimo 10 letras).')),
        ),

        // Cenário B: Nota Alta (3, 4 ou 5 estrelas)
        // Regra: Opcional, mas se escrever, Mínimo 5 caracteres
        when((values) => Number(values.rating) >= 3, minLength(5, 'O comentário é curto demais.')),
      ),
    });
  }, [setValidators]);

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors mx-auto">
      <div className="border-b border-gray-100 dark:border-gray-700 pb-4 mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="text-purple-600 dark:text-purple-400" />
          Regras Dinâmicas
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Exemplo de validação condicional (<code>when</code>) e composição (<code>pipe</code>).
        </p>
      </div>

      <form {...formProps} className="space-y-8">
        {/* BLOCO 1: DADOS BÁSICOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 flex items-center gap-1">
              <User size={12} /> Nome
            </label>
            <input name="nome" data-validation="nome" className="form-input" placeholder="Seu nome" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 flex items-center gap-1">
              <Mail size={12} /> Email
            </label>
            <input name="email" data-validation="email" className="form-input" placeholder="seu@email.com" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 flex items-center gap-1">
              <Lock size={12} /> Senha
            </label>
            <input name="senha" data-validation="senha" type="password" className="form-input" placeholder="••••••" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 flex items-center gap-1">
              <Lock size={12} /> Confirmar
            </label>
            <input name="confirmarSenha" data-validation="confirmarSenha" type="password" className="form-input" placeholder="••••••" />
          </div>
        </div>

        {/* BLOCO 2: CONDICIONAL SIMPLES */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <input
              name="temEmpresa"
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Represento uma Empresa</label>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 flex items-center gap-1">
              <Building2 size={12} /> CNPJ (Condicional)
            </label>
            <input name="cnpj" data-validation="cnpj" className="form-input" placeholder="00.000.000/0000-00" {...cnpjMask} />
            <p className="text-[10px] text-gray-400 mt-1">* Obrigatório apenas se o checkbox acima estiver marcado.</p>
          </div>
        </div>

        {/* BLOCO 3: CONDICIONAL COMPLEXA (Rating) */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mb-4 uppercase flex items-center gap-2">
            <Star size={16} /> Pesquisa de Satisfação
          </h4>

          <div className="mb-4">
            <StarRating
              name="rating"
              label="Sua Nota"
              required
              validationKey="rating"
              className="mb-0"
              starClassName="w-8 h-8 text-gray-300 dark:text-gray-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 flex items-center gap-1">
              <MessageSquare size={12} /> Comentário
            </label>
            <textarea
              name="comentario"
              data-validation="comentario"
              className="form-input h-24 resize-none"
              placeholder="Conte-nos mais..."
            />
            <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-[10px] text-gray-500 dark:text-gray-400">
              <p>
                <strong>Regra Dinâmica:</strong>
              </p>
              <ul className="list-disc pl-3 mt-1 space-y-0.5">
                <li>
                  Nota 1-2: Comentário <strong>Obrigatório</strong> (min 10 chars).
                </li>
                <li>
                  Nota 3-5: Comentário <strong>Opcional</strong> (min 5 chars se preenchido).
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            type="submit"
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95">
            Validar Tudo
          </button>
        </div>
      </form>
    </div>
  );
};

export default TabValidationComplexExample;
