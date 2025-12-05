import React from "react";
import showModal from "../../componentes/modal/hook";
import DateRangePicker from "../../componentes/range-date-picker";
import useForm from "../../hooks/use-form";
import { getToday, addDays, toISODate } from "../../utils/date";

const DateRangeExample: React.FC = () => {
  // Helpers para datas relativas
  const today = getToday();
  const nextWeek = addDays(today, 7);
  const prevMonth = addDays(today, -30);

  const handleReset = () => {
    resetSection("", null);
  };

  const handleSimulateEdit = () => {
    // Simula carga de um período específico (ex: promoção de natal)
    const natalStart = "2023-12-20";
    const natalEnd = "2023-12-31";

    resetSection("", {
      livre_inicio: natalStart,
      livre_fim: natalEnd,
      restrito_inicio: natalStart, // Vai falhar se estiver fora do min/max
      restrito_fim: natalEnd,
    });
  };

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
  const { formProps, resetSection } = useForm({ id: "date-example", onSubmit });

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-cyan-400">Date Range Picker</h2>
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

      <form {...formProps} noValidate className="space-y-6">
        {/* 1. LIVRE */}
        <div className="p-4 bg-gray-900/30 rounded border border-gray-700">
          <h3 className="text-xs text-gray-500 font-bold uppercase mb-3">
            1. Seleção Livre
          </h3>
          <DateRangePicker
            startDateName="livre_inicio"
            endDateName="livre_fim"
            label="Qualquer Período"
          />
        </div>

        {/* 2. RESTRITO (Min/Max) */}
        <div className="p-4 bg-gray-900/30 rounded border border-gray-700">
          <h3 className="text-xs text-gray-500 font-bold uppercase mb-3">
            2. Restrito (Passado Bloqueado)
          </h3>
          <p className="text-xs text-gray-400 mb-2">
            Permite apenas datas a partir de hoje até 30 dias.
          </p>
          <DateRangePicker
            startDateName="restrito_inicio"
            endDateName="restrito_fim"
            label="Agendamento Futuro"
            minDate={toISODate(today)}
            maxDate={toISODate(addDays(today, 30))}
            required
          />
        </div>

        {/* 3. DIAS ÚTEIS */}
        <div className="p-4 bg-gray-900/30 rounded border border-gray-700">
          <h3 className="text-xs text-gray-500 font-bold uppercase mb-3">
            3. Apenas Dias Úteis
          </h3>
          <DateRangePicker
            startDateName="util_inicio"
            endDateName="util_fim"
            label="Prazo de Entrega"
            excludeWeekends
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
              label="Histórico (Leitura)"
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
