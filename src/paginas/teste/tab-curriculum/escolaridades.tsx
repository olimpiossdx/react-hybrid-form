import React from 'react'
import type { IEscolaridade } from './types';
import useList from '../../../hooks/list';

interface Props {
  data?: IEscolaridade[]; // Tipagem Forte!
}

const Escolaridades: React.FC<Props> = ({ data = [] }) => {
  // O useList<IEscolaridade> cria itens onde item.data é do tipo IEscolaridade
  const { items, add, remove } = useList<IEscolaridade>(data);

  return (
    <div className="bg-gray-900/30 p-4 rounded border border-gray-700/50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-300 uppercase">2. Formação Acadêmica</h3>
        <button type="button" onClick={() => add()} className="text-xs bg-cyan-900 text-cyan-200 px-3 py-1 rounded hover:bg-cyan-800 transition-colors">
          + Adicionar
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="bg-gray-800 p-3 rounded border border-gray-700 flex flex-col md:flex-row gap-3 relative animate-in fade-in slide-in-from-left-2">
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase">Instituição</label>
                <input
                  name={`escolaridades[${index}].instituicao`}
                  // AQUI: Injeção direta do valor inicial via prop
                  defaultValue={item.data.instituicao}
                  className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 uppercase">Curso</label>
                <input
                  name={`escolaridades[${index}].curso`}
                  defaultValue={item.data.curso}
                  className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 uppercase">Ano</label>
                <input
                  name={`escolaridades[${index}].ano`}
                  type="number"
                  defaultValue={item.data.ano}
                  className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              className="text-gray-500 hover:text-red-400 self-center p-2 hover:bg-red-900/20 rounded transition-colors"
              title="Remover curso"
            >
              ✕
            </button>
          </div>
        ))}

        {items.length === 0 && <p className="text-center text-xs text-gray-500 py-2">Nenhuma formação adicionada.</p>}
      </div>
    </div>
  );
};

export default Escolaridades;