import React from 'react'
import type { IDadosAdicionais } from './types';

interface Props {
  data?: IDadosAdicionais;
}

const DadosAdicionais: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-gray-900/30 p-4 rounded border border-gray-700/50">
      <h3 className="text-sm font-bold text-gray-300 uppercase mb-4">
        5. Informações Adicionais
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Checkbox Simples */}
        <div className="flex items-center gap-3 p-3 bg-gray-800 rounded border border-gray-600">
          <input
            type="checkbox"
            name="adicionais.disponibilidadeImediata"
            defaultChecked={data?.disponibilidadeImediata}
            className="w-5 h-5 rounded border-gray-500 bg-gray-700 text-cyan-500"
          />
          <span className="text-gray-300 text-sm">Disponibilidade Imediata</span>
        </div>

        {/* Input Numérico */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Pretensão Salarial (R$)</label>
          <input
            name="adicionais.pretensaoSalarial"
            type="number"
            defaultValue={data?.pretensaoSalarial}
            className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-white font-mono"
          />
        </div>
      </div>
    </div>
  );
};

export default DadosAdicionais;