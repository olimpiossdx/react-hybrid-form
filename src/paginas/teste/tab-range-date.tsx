import React from "react";
import { createDate, getToday } from "../../utils/date";
import DateRangePicker, {
  type DatePreset,
} from "../../componentes/range-date-picker";
import useForm from "../../hooks/use-form";
import showModal from "../../componentes/modal/hook";

// Presets de Negócio (Exemplo Financeiro)
const FINANCIAL_PRESETS: DatePreset[] = [
  {
    label: "1º Semestre",
    getValue: () => [
      createDate(getToday().getFullYear(), 0, 1),
      createDate(getToday().getFullYear(), 5, 30),
    ],
  },
  {
    label: "Ano Passado",
    getValue: () => [
      createDate(getToday().getFullYear() - 1, 0, 1),
      createDate(getToday().getFullYear() - 1, 11, 31),
    ],
  },
];

const DateRangeExample: React.FC = () => {
  const onSubmit = (data: any) => {
    showModal({
      title: "Filtros Selecionados",
      content: () => (
        <pre className="text-xs bg-black p-4 rounded text-green-400 overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      ),
    });
  };

  const handleReset = () => {
    resetSection("", null);
  };

  const handleSimulateEdit = () => {
    const natalStart = "2023-12-20";
    const natalEnd = "2023-12-31";

    resetSection("", {
      livre_inicio: natalStart,
      livre_fim: natalEnd,
      fiscal_inicio: "2023-01-01",
      fiscal_fim: "2023-12-31",
      simple_inicio: "",
      simple_fim: "",
    });
  };

  const { formProps, resetSection } = useForm({id: "date-example", onSubmit});
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-cyan-400">
          Date Range Picker v2
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleSimulateEdit}
            type="button"
            className="px-3 py-1 text-xs bg-blue-900 text-blue-200 rounded hover:bg-blue-800 border border-blue-700"
          >
            Simular Edição
          </button>
          <button
            onClick={handleReset}
            type="button"
            className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 border border-gray-600"
          >
            Resetar
          </button>
        </div>
      </div>

      <form {...formProps} noValidate
        className="space-y-6"
      >
        {/* 1. PADRÃO (Presets Default) */}
        <div className="p-4 bg-gray-900/30 rounded border border-gray-700">
          <h3 className="text-xs text-gray-500 font-bold uppercase mb-3">
            1. Padrão (Com Presets)
          </h3>
          <DateRangePicker
            startDateName="livre_inicio"
            endDateName="livre_fim"
            label="Período Geral"
          />
        </div>

        {/* 2. CUSTOM PRESETS */}
        <div className="p-4 bg-gray-900/30 rounded border border-gray-700">
          <h3 className="text-xs text-gray-500 font-bold uppercase mb-3">
            2. Presets Customizados (Financeiro)
          </h3>
          <DateRangePicker
            startDateName="fiscal_inicio"
            endDateName="fiscal_fim"
            label="Período Fiscal"
            presets={FINANCIAL_PRESETS}
          />
        </div>

        {/* 3. CLEAN (Sem Sidebar) */}
        <div className="p-4 bg-gray-900/30 rounded border border-gray-700">
          <h3 className="text-xs text-gray-500 font-bold uppercase mb-3">
            3. Simplificado (Sem Presets)
          </h3>
          <DateRangePicker
            startDateName="simple_inicio"
            endDateName="simple_fim"
            label="Datas Específicas"
            showPresets={false} // Desliga a sidebar
            excludeWeekends // Regra extra
            required
          />
        </div>

        {/* 4. ESTADOS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-900/30 rounded border border-gray-700 opacity-75">
            <h3 className="text-xs text-gray-500 font-bold uppercase mb-3">
              4. Disabled
            </h3>
            <DateRangePicker
              startDateName="disabled_inicio"
              endDateName="disabled_fim"
              label="Bloqueado"
              disabled
            />
          </div>
          <div className="p-4 bg-gray-900/30 rounded border border-gray-700">
            <h3 className="text-xs text-gray-500 font-bold uppercase mb-3">
              5. Read Only
            </h3>
            <DateRangePicker
              startDateName="readonly_inicio"
              endDateName="readonly_fim"
              label="Histórico"
              readOnly
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-700">
          <button
            type="submit"
            className="px-8 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded shadow-lg"
          >
            Filtrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default DateRangeExample;
