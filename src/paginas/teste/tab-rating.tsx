import React, { useState } from 'react';
import { Heart, Medal, MessageSquare, Star, ThumbsUp } from 'lucide-react';

import showModal from '../../componentes/modal/hook';
import StarRating from '../../componentes/start-rating';
import useForm from '../../hooks/use-form';

interface IRateForm {
  nota_servico: number;
  nota_nps: number;
  nota_design: number;
  nota_readonly: number;
}

const StarRatingExample = () => {
  const [npsMessage, setNpsMessage] = useState('');

  const onSubmit = (data: IRateForm) => {
    showModal({
      title: 'Avaliação Enviada',
      size: 'sm',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-yellow-500 justify-center">
            <Star fill="currentColor" size={32} />
            <span className="text-2xl font-bold">Obrigado!</span>
          </div>
          <pre className="text-xs bg-gray-100 dark:bg-black p-4 rounded border border-gray-200 dark:border-gray-700 overflow-auto text-gray-700 dark:text-gray-300">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ),
    });
  };

  const { formProps } = useForm<IRateForm>({
    id: 'star-rating-form',
    onSubmit,
  });

  // Callback para Ilha de Reatividade (NPS)
  const handleNpsChange = (val: number) => {
    if (val <= 6) {
      setNpsMessage('😟 Poxa, que pena! O que podemos melhorar?');
    } else if (val <= 8) {
      setNpsMessage('😐 Obrigado! Vamos tentar melhorar.');
    } else {
      setNpsMessage('🤩 Uau! Ficamos muito felizes!');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
          <Star size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Avaliações & Feedback</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Componente acessível com suporte a teclado, touch e customização.</p>
        </div>
      </div>

      <form {...formProps} className="space-y-8">
        {/* 1. PADRÃO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3 text-gray-900 dark:text-white font-bold text-sm uppercase">
              <MessageSquare size={16} className="text-blue-500" />
              1. Padrão (5 Estrelas)
            </div>

            <StarRating name="nota_servico" label="O que achou do atendimento?" required className="mb-0" />
            <p className="text-[10px] text-gray-500 mt-2">* Campo obrigatório. Tente salvar vazio para ver o erro nativo.</p>
          </div>

          {/* 2. CUSTOMIZADO (NPS - 10 Ícones) */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3 text-gray-900 dark:text-white font-bold text-sm uppercase">
              <Medal size={16} className="text-purple-500" />
              2. NPS (10 Pontos)
            </div>

            <StarRating
              name="nota_nps"
              label="Probabilidade de recomendação"
              maxStars={10}
              onChange={handleNpsChange}
              starClassName="w-5 h-5 text-purple-500" // Custom CSS
              className="mb-1"
            />

            <div className="h-6 mt-2">
              {npsMessage && (
                <span className="text-xs font-medium text-purple-600 dark:text-purple-300 animate-in fade-in slide-in-from-top-1 block">
                  {npsMessage}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3. ÍCONES CUSTOMIZADOS (Hearts/Thumbs) */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase flex items-center gap-2">
            <Heart size={16} className="text-red-500" /> 3. Estilização Avançada (SVG Swap)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Como o StarRating atual usa SVG fixo, a customização de ícone
                            exige alterar o componente ou usar CSS trick se o SVG for vazado.
                            Para este exemplo, usamos o starClassName para mudar cores e tamanhos drásticos.
                        */}

            <div>
              <StarRating
                name="nota_design"
                label="Design (Estrelas Grandes)"
                starClassName="w-8 h-8 text-pink-500 hover:scale-125 transition-transform"
              />
            </div>

            <div>
              {/* Read Only com valor inicial */}
              <StarRating
                name="nota_readonly"
                label="Média Atual (Somente Leitura)"
                initialValue={4}
                readOnly
                starClassName="w-6 h-6 text-gray-400 dark:text-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-700">
          <button
            type="submit"
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg active:scale-95 transition-transform">
            Enviar Avaliação
          </button>
        </div>
      </form>
    </div>
  );
};

export default StarRatingExample;
