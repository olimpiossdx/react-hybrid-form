import React from 'react'
import type { ICurriculumFormValues } from './types';


interface Props {
  data?: ICurriculumFormValues | null;
}

const DadosPessoais: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-gray-900/30 p-4 rounded border border-gray-700/50">
      <h3 className="text-sm font-bold text-gray-300 uppercase mb-4">1. Dados Pessoais</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Nome Completo</label>
          <input
            name="nome"
            defaultValue={data?.nome}
            className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">E-mail</label>
          <input
            name="email"
            type="email"
            defaultValue={data?.email}
            className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-400 mb-1">Resumo Profissional</label>
          <textarea
            name="resumo"
            rows={3}
            defaultValue={data?.resumo}
            className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default DadosPessoais;