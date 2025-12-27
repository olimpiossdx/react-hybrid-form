import React, { useEffect } from 'react';

import Autocomplete from '../../../../componentes/autocomplete';
import StarRating from '../../../../componentes/start-rating';
import Switch from '../../../../componentes/switch';
import useForm from '../../../../hooks/use-form';
import type { IEmployee, IEmployeeFormData } from '../types';

const ROLES_OPTIONS = [
  { value: 'Frontend Developer', label: 'Frontend Developer' },
  { value: 'Backend Engineer', label: 'Backend Engineer' },
  { value: 'Product Owner', label: 'Product Owner' },
  { value: 'UX Designer', label: 'UX Designer' },
];

interface Props {
  employee: IEmployee | null;
  onSave: (data: IEmployeeFormData) => Promise<void>;
  onCancel: () => void;
}

const EmployeeModal: React.FC<Props> = ({ employee, onSave, onCancel }) => {
  const { formProps, resetSection, setValidators } = useForm<IEmployeeFormData>({ id: 'employee-modal-form', onSubmit: onSave });

  useEffect(() => {
    if (employee) {
      const formData = {
        ...employee,
        role: { value: employee.role, label: employee.role },
      };
      setTimeout(() => resetSection('', formData), 50);
    } else {
      setTimeout(() => resetSection('', null), 50);
    }
  }, [employee, resetSection]);

  useEffect(() => {
    setValidators({
      name: (val: string) => (!val || val.length < 3 ? { message: 'Nome completo obrigatório', type: 'error' } : undefined),
      role: (val: any) => (!val ? { message: 'Cargo obrigatório', type: 'error' } : undefined),
      rating: (val: number) => (val < 1 ? { message: 'Avaliação mínima 1', type: 'error' } : undefined),
    });
  }, [setValidators]);

  return (
    <form {...formProps} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1 block">Nome</label>
          <input name="name" className="form-input" required data-validation="name" />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1 block">E-mail</label>
          <input name="email" type="email" className="form-input" required />
        </div>
        <div>
          <Autocomplete name="role" label="Cargo" options={ROLES_OPTIONS} required validationKey="role" />
        </div>
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold block mb-1">Admissão</label>
          <input name="admissionDate" type="date" className="form-input" required />
        </div>
        <div className="col-span-1">
          <StarRating name="rating" label="Performance" required validationKey="rating" />
        </div>
        <div className="col-span-1 flex items-center pt-6">
          <Switch name="status" label="Usuário Ativo" />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded shadow-lg transition-transform active:scale-95">
          {employee ? 'Atualizar' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
};
export default EmployeeModal;
