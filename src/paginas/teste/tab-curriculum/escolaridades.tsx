import React from "react";
import useList from "../../../hooks/list";
import type { IEscolaridade } from "./types";
import { GraduationCap, Plus, Trash2 } from "lucide-react";

interface Props {
  data?: IEscolaridade[];
}

const Escolaridades: React.FC<Props> = ({ data = [] }) => {
  // O useList inicializa a estrutura baseada nos dados recebidos (Data-Driven)
  const { items, add, remove } = useList<IEscolaridade>(data);

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase flex items-center gap-2">
          <GraduationCap
            size={16}
            className="text-purple-600 dark:text-purple-400"
          />
          2. Formação Acadêmica
        </h3>
        <button
          type="button"
          onClick={() => add()}
          className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 px-3 py-1.5 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors flex items-center gap-1 border border-purple-200 dark:border-purple-800"
        >
          <Plus size={14} /> Adicionar
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4 relative animate-in fade-in slide-in-from-left-2 shadow-sm"
          >
            <div className="grow grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Instituição
                </label>
                <input
                  name={`escolaridades[${index}].instituicao`}
                  defaultValue={item.data.instituicao}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Curso
                </label>
                <input
                  name={`escolaridades[${index}].curso`}
                  defaultValue={item.data.curso}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Ano Conclusão
                </label>
                <input
                  name={`escolaridades[${index}].ano`}
                  type="number"
                  defaultValue={item.data.ano}
                  className="form-input text-center font-mono"
                  required
                />
              </div>
            </div>

            <div className="flex items-end pb-1">
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                title="Remover curso"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Nenhuma formação registrada.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Escolaridades;
