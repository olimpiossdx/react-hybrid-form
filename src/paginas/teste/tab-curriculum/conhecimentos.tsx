import React from 'react';
import { Layers } from 'lucide-react';

interface Props {
  selected?: string[];
}

const Conhecimentos: React.FC<Props> = ({ selected = [] }) => {
  const stacks = [
    { id: 'js', label: 'JavaScript' },
    { id: 'ts', label: 'TypeScript' },
    { id: 'react', label: 'React' },
    { id: 'node', label: 'Node.js' },
    { id: 'python', label: 'Python' },
    { id: 'go', label: 'Go' },
    { id: 'docker', label: 'Docker' },
    { id: 'aws', label: 'AWS' },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-4 flex items-center gap-2">
        <Layers size={16} className="text-orange-600 dark:text-orange-400" />
        4. Conhecimentos Técnicos
      </h3>

      {/* MESTRE */}
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <label className="flex items-center gap-3 text-cyan-700 dark:text-cyan-400 font-bold cursor-pointer w-fit p-2 hover:bg-white dark:hover:bg-gray-800 rounded transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
          <input
            type="checkbox"
            data-checkbox-master="conhecimentos"
            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-cyan-600 focus:ring-cyan-500"
          />
          Selecionar Todas as Stacks
        </label>
      </div>

      {/* FILHOS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stacks.map((tech) => (
          <label
            key={tech.id}
            className="flex items-center gap-2.5 p-2 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-cyan-500 dark:hover:border-cyan-500 transition-all text-gray-700 dark:text-gray-300 hover:text-cyan-700 dark:hover:text-cyan-300 shadow-sm">
            <input
              type="checkbox"
              name="conhecimentos"
              value={tech.id}
              defaultChecked={selected.includes(tech.id)}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="text-sm font-medium">{tech.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Conhecimentos;
