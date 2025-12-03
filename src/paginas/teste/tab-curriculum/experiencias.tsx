import React from 'react'
import useList from '../../../hooks/list';
import type { IExperiencia } from './types';


interface Props {
  data?: IExperiencia[];
  isEditing?: boolean; // Opcional: se quiser controlar visualmente modo leitura/edição
}

const PREFIX = "experiencias";

const Experiencias: React.FC<Props> = ({ data = [] }) => {
  // O hook useList agora inicializa os items com os dados passados
  const { items, add, remove } = useList<IExperiencia>(data);

  return (
    <div className="bg-gray-900/30 p-4 rounded border border-gray-700/50">
      <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
        <h3 className="text-sm font-bold text-gray-300 uppercase">3. Experiência Profissional</h3>
        <button
          type="button"
          onClick={() => add()} // Adiciona linha vazia
          className="text-xs bg-cyan-900 text-cyan-200 px-3 py-1 rounded hover:bg-cyan-800 transition-colors"
        >
          + Adicionar
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="bg-gray-800 p-3 rounded border border-gray-700 flex flex-col md:flex-row gap-3 items-start animate-in fade-in slide-in-from-left-2">
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase">Empresa</label>
                <input
                  name={`${PREFIX}[${index}].empresa`}
                  defaultValue={item.data.empresa}
                  className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 uppercase">Cargo</label>
                <input
                  name={`${PREFIX}[${index}].cargo`}
                  defaultValue={item.data.cargo}
                  className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none"
                  required
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-[10px] text-gray-500 uppercase">Início</label>
                  <input
                    name={`${PREFIX}[${index}].anoInicio`}
                    type="number"
                    defaultValue={item.data.anoInicio}
                    className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] text-gray-500 uppercase">Fim</label>
                  <input
                    name={`${PREFIX}[${index}].anoFim`}
                    type="number"
                    defaultValue={item.data.anoFim}
                    className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              className="text-gray-500 hover:text-red-400 pt-6 px-2 transition-colors"
              title="Remover experiência"
            >
              ✕
            </button>
          </div>
        ))}

        {items.length === 0 && <p className="text-center text-xs text-gray-500 py-2">Nenhuma experiência registrada.</p>}
      </div>
    </div>
  );
};

export default Experiencias;