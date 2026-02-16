import React from 'react';
import { Edit3, RefreshCw, Save } from 'lucide-react';

import type { IOption } from '../../componentes/autocomplete';
import Autocomplete from '../../componentes/autocomplete';
import showModal from '../../componentes/modal/hook';
import StarRating from '../../componentes/start-rating';
import useForm from '../../hooks/use-form';

// DADOS MOCK
const DADOS_INICIAIS = {
  rating: 5,
  corFavorita: 'azul',
  comentario: 'Teste de Cancelamento',
};

const CORES_OPTIONS: IOption[] = [
  { value: 'vermelho', label: 'Vermelho' },
  { value: 'azul', label: 'Azul Marinho' },
  { value: 'verde', label: 'Verde' },
];

interface IHybridFormValues {
  rating: number;
  corFavorita: string;
  comentario: string;
}

const HybridFormSimple = () => {
  const [isEditing, setIsEditing] = React.useState(false);

  const onSubmit = (data: IHybridFormValues) => {
    showModal({
      title: 'Dados Salvos!',
      size: 'sm',
      content: (
        <div className="space-y-2">
          <p className="text-gray-300">O formulário híbrido processou os dados abaixo:</p>
          <pre className="bg-black p-4 text-green-400 rounded text-xs overflow-auto border border-gray-700">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ),
      actions: (
        <div className="flex justify-end">
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
            Fechar
          </button>
        </div>
      ),
    });
    setIsEditing(false);
  };

  // DX Aprimorada: Configuração no hook com validadores customizados
  const { formProps, resetSection, setValidators } = useForm<IHybridFormValues>({ id: 'hybrid-simple', onSubmit });

  // Configura validadores customizados após inicialização
  React.useEffect(() => {
    setValidators({
      comentarioValidator: (value, _, formModel) => {
        const rating = formModel.rating || 0;

        // Se rating <= 3, comentário é obrigatório e precisa ter pelo menos 10 caracteres
        if (rating <= 3) {
          if (!value || String(value).trim() === '') {
            return { message: 'Comentário é obrigatório para avaliações de 3 estrelas ou menos', type: 'error' };
          }
          if (String(value).trim().length < 10) {
            return { message: 'Comentário deve ter pelo menos 10 caracteres para avaliações baixas', type: 'error' };
          }
        }
      },
      corFavoritaValidator: (value, _, formModel) => {
        const rating = Number(formModel.rating || 0);

        // Se rating < 3, apenas a cor Verde pode ser selecionada (OPÇÃO 2: Validável mas clicável)
        if (rating < 3 && value !== 'verde') {
          return {
            message: 'Para avaliações abaixo de 3 estrelas, apenas a cor Verde pode ser selecionada',
            type: 'error',
          };
        }
      },
    });
  }, [setValidators]);

  const handleEdit = () => {
    setIsEditing(true);
    // Simula carga de dados
    setTimeout(() => resetSection('', DADOS_INICIAIS), 50);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTimeout(() => resetSection('', DADOS_INICIAIS), 50);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-cyan-400">Ciclo de Vida</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Teste de Edição, Cancelamento e Reset.</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-bold shadow-md">
              <Edit3 size={16} /> Editar
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-bold">
              <RefreshCw size={16} /> Cancelar
            </button>
          )}
        </div>
      </div>

      <form {...formProps} className="space-y-6" id="hybrid-simple">
        <fieldset disabled={!isEditing} className="space-y-6 transition-opacity duration-300 disabled:opacity-60">
          <StarRating name="rating" label="Avaliação (Ao cancelar, volta p/ 5)" required className="mb-6" />

          <Autocomplete
            name="corFavorita"
            label="Cor Favorita"
            options={CORES_OPTIONS}
            required
            placeholder="Selecione uma cor..."
            data-validation="corFavoritaValidator"
          />

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Comentário</label>
            <input name="comentario" className="form-input" placeholder="Digite algo..." data-validation="comentarioValidator" />
          </div>

          {isEditing && (
            <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95">
                <Save size={18} /> Salvar Alterações
              </button>
            </div>
          )}
        </fieldset>
      </form>
    </div>
  );
};

export default HybridFormSimple;
