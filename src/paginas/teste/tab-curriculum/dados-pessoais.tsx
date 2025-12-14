import React from 'react';
import { type ICurriculumFormValues } from './types';
import { User, Mail, FileText } from 'lucide-react';

interface Props {
  data?: Partial<ICurriculumFormValues>;
}

const DadosPessoais: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-4 flex items-center gap-2">
        <User size={16} className="text-cyan-600 dark:text-cyan-400" />
        1. Dados Pessoais
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Nome Completo</label>
            <div className="relative">
                <input 
                    name="nome" 
                    defaultValue={data?.nome}
                    className="form-input pl-10" 
                    required 
                    placeholder="Seu nome"
                />
                <User className="absolute left-3 top-2.5 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
        </div>
        
        <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">E-mail</label>
            <div className="relative">
                <input 
                    name="email" 
                    type="email"
                    defaultValue={data?.email}
                    className="form-input pl-10" 
                    required 
                    placeholder="exemplo@email.com"
                />
                <Mail className="absolute left-3 top-2.5 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
        </div>
        
        <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Resumo Profissional</label>
            <div className="relative">
                <textarea 
                    name="resumo" 
                    rows={3} 
                    defaultValue={data?.resumo}
                    className="form-input pl-10 pt-3" 
                    placeholder="Breve descrição..."
                />
                <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default DadosPessoais;