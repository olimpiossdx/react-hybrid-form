import React from "react";
import type { IDadosAdicionais } from "./types";
import { FilePlus, DollarSign } from "lucide-react";

interface Props {
  data?: IDadosAdicionais;
}

const DadosAdicionais: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-4 flex items-center gap-2">
        <FilePlus size={16} className="text-gray-500 dark:text-gray-400" />
        5. Informações Adicionais
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Checkbox Simples */}
        <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <input
            type="checkbox"
            name="adicionais.disponibilidadeImediata"
            defaultChecked={data?.disponibilidadeImediata}
            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500"
          />
          <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
            Disponibilidade Imediata
          </span>
        </div>

        {/* Input Numérico */}
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
            Pretensão Salarial
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" />
            <input
              name="adicionais.pretensaoSalarial"
              type="number"
              defaultValue={data?.pretensaoSalarial}
              className="form-input pl-9 font-mono font-bold text-green-600 dark:text-green-400"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DadosAdicionais;
