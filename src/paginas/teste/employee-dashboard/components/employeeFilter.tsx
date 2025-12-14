import { Search } from "lucide-react";
import React from "react";
import Autocomplete from "../../../../componentes/autocomplete";
import DateRangePicker from "../../../../componentes/range-date-picker";
import useForm from "../../../../hooks/use-form";
import type { IEmployeeFilter } from "../types";

const ROLES_OPTIONS = [
  { value: "Frontend Developer", label: "Frontend" },
  { value: "Backend Engineer", label: "Backend" },
  { value: "Product Owner", label: "Produto" },
  { value: "UX Designer", label: "Design" },
];

const EmployeeFilter: React.FC<{ onFilter: (f: IEmployeeFilter) => void }> = ({
  onFilter,
}) => {
  const { formProps } = useForm<IEmployeeFilter>({
    id: "employee-filter-form",
    onSubmit: onFilter,
  });

  return (
    <form
      {...formProps}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6 flex flex-col md:flex-row gap-4 items-end shadow-sm"
    >
      <div className="flex-1 w-full">
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">
          Buscar
        </label>
        <div className="relative">
          <input
            name="term"
            className="form-input pl-9"
            placeholder="Nome ou E-mail..."
          />
          <Search className="absolute left-2.5 top-2.5 text-gray-400 w-4 h-4 z-10 pointer-events-none" />
        </div>
      </div>
      <div className="w-full md:w-48">
        <Autocomplete
          name="role"
          label="Cargo"
          options={ROLES_OPTIONS}
          placeholder="Todos"
          clearable
        />
      </div>
      <div className="w-full md:w-64">
        <DateRangePicker
          startDateName="date_start"
          endDateName="date_end"
          label="Admissão"
          matchInputWidth
        />
      </div>
      <button
        type="submit"
        className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-md transition-transform active:scale-95 h-[42px] mb-px"
      >
        Filtrar
      </button>
    </form>
  );
};
export default EmployeeFilter;
