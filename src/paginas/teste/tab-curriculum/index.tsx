import React, { useState } from 'react';
import { CheckCircle, Download, FileText, RotateCcw, Save } from 'lucide-react';

import Conhecimentos from './conhecimentos';
import DadosAdicionais from './dados-adicionais';
import DadosPessoais from './dados-pessoais';
import Escolaridades from './escolaridades';
import Experiencias from './experiencias';
import type { ICurriculumFormValues } from './types';
import showModal from '../../../componentes/modal/hook';
import useForm from '../../../hooks/use-form';

// MOCK DATA
const DATA_MOCK: ICurriculumFormValues = {
  nome: 'Ana Souza',
  email: 'ana.souza@tech.com',
  resumo: 'Engenheira de Software Sênior com foco em arquitetura React.',
  escolaridades: [
    { instituicao: 'USP', curso: 'Ciência da Computação', ano: 2019 },
    { instituicao: 'Rocketseat', curso: 'Ignite ReactJS', ano: 2021 },
  ],
  experiencias: [
    {
      empresa: 'Tech Corp',
      cargo: 'Frontend Lead',
      anoInicio: 2022,
      anoFim: 2024,
    },
    {
      empresa: 'StartUp X',
      cargo: 'Frontend Pleno',
      anoInicio: 2020,
      anoFim: 2021,
    },
  ],
  conhecimentos: ['react', 'node', 'typescript', 'aws'],
  dadosAdicionais: { pretensaoSalarial: 8500, disponibilidadeImediata: true },
};

const EMPTY_DATA: ICurriculumFormValues = {
  nome: '',
  email: '',
  resumo: '',
  escolaridades: [],
  experiencias: [],
  conhecimentos: [],
  dadosAdicionais: { pretensaoSalarial: 0, disponibilidadeImediata: false },
};

const CurriculumForm: React.FC = () => {
  const onSubmit = (data: ICurriculumFormValues) => {
    showModal({
      title: 'Currículo Salvo',
      size: 'lg',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-green-600 dark:text-green-400 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
            <CheckCircle size={24} />
            <div>
              <h4 className="font-bold">Sucesso!</h4>
              <p className="text-xs">Dados capturados do DOM com sucesso.</p>
            </div>
          </div>
          <pre className="text-xs bg-gray-100 dark:bg-black p-4 rounded text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 overflow-auto max-h-[60vh]">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ),
    });
  };

  const { formProps, resetSection } = useForm<ICurriculumFormValues>({
    id: 'curriculum-form',
    onSubmit,
  });

  const [formData, setFormData] = useState<ICurriculumFormValues>(EMPTY_DATA);
  const [mode, setMode] = useState<'novo' | 'editando'>('novo');

  const handleLoadMock = () => {
    setMode('editando');
    setFormData(DATA_MOCK);
    setTimeout(() => resetSection('', DATA_MOCK), 0);
  };

  const handleReset = () => {
    setMode('novo');
    setFormData(EMPTY_DATA);
    setTimeout(() => resetSection('', null), 0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-5xl mx-auto transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-100 dark:border-gray-700 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-cyan-400 flex items-center gap-2">
            <FileText size={24} />
            Currículo Profissional
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Formulário complexo com listas dinâmicas, grupos e validação.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleLoadMock}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            <Download size={14} /> Carregar Mock
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <RotateCcw size={14} /> Limpar
          </button>
        </div>
      </div>

      {/* KEY: Garante remontagem para limpar listas dinâmicas */}
      <form {...formProps} className="space-y-8" key={mode === 'editando' ? 'loaded' : 'empty'}>
        <DadosPessoais data={formData} />
        <Escolaridades data={formData.escolaridades} />
        <Experiencias data={formData.experiencias} />
        <Conhecimentos selected={formData.conhecimentos} />
        <DadosAdicionais data={formData.dadosAdicionais} />

        <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-700">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg hover:shadow-green-500/20 transition-all active:scale-95">
            <Save size={18} /> Salvar Currículo
          </button>
        </div>
      </form>
    </div>
  );
};

export default CurriculumForm;
