import React from 'react';
import { Briefcase, Plus, Trash2 } from 'lucide-react';

import type { IExperiencia } from './types';
import useList from '../../../hooks/list';

interface Props {
  data?: IExperiencia[];
}

const Experiencias: React.FC<Props> = ({ data = [] }) => {
  const { items, add, remove } = useList<IExperiencia>(data);

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase flex items-center gap-2">
          <Briefcase size={16} className="text-blue-600 dark:text-blue-400" />
          3. Experiência Profissional
        </h3>
        <button
          type="button"
          onClick={() => add()}
          className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 px-3 py-1.5 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1 border border-blue-200 dark:border-blue-800">
          <Plus size={14} /> Adicionar
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4 animate-in fade-in slide-in-from-left-2 shadow-sm">
            <div className="grow grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Empresa</label>
                <input name={`experiencias[${index}].empresa`} defaultValue={item.data.empresa} className="form-input" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Cargo</label>
                <input name={`experiencias[${index}].cargo`} defaultValue={item.data.cargo} className="form-input" required />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Início</label>
                  <input
                    name={`experiencias[${index}].anoInicio`}
                    type="number"
                    defaultValue={item.data.anoInicio}
                    className="form-input text-center font-mono"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Fim</label>
                  <input
                    name={`experiencias[${index}].anoFim`}
                    type="number"
                    defaultValue={item.data.anoFim}
                    className="form-input text-center font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-end pb-1">
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 text-xs">
            Nenhuma experiência registrada.
          </div>
        )}
      </div>
    </div>
  );
};

export default Experiencias;
