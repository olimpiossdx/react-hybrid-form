import React from "react";
import { toISODate, addDays, getToday, createDate } from "../../utils/date";
import {  Calendar,  Layout,  Smartphone,  ShieldAlert,  MousePointer2,  RotateCcw, Download, Maximize2,} from "lucide-react";
import { showModal } from "../../componentes/modal";
import DateRangePicker from "../../componentes/range-date-picker";
import type { DatePreset } from "../../componentes/range-date-picker/props";
import useForm from "../../hooks/use-form";

interface IDateForm {
  enterprise_start: string;
  enterprise_end: string;
  size_sm_start: string;
  size_sm_end: string;
  size_lg_start: string;
  size_lg_end: string;
  mobile_start: string;
  mobile_end: string;
  restricted_start: string;
  restricted_end: string;
  business_start: string;
  business_end: string;
  fiscal_start: string;
  fiscal_end: string;
  edge_left_start?: string;
  edge_left_end?: string;
  edge_right_start?: string;
  edge_right_end?: string;
}

const FINANCIAL_PRESETS: DatePreset[] = [
  {
    label: "1º Semestre",
    getValue: () => [
      createDate(getToday().getFullYear(), 0, 1),
      createDate(getToday().getFullYear(), 5, 30),
    ],
  },
  {
    label: "2º Semestre",
    getValue: () => [
      createDate(getToday().getFullYear(), 6, 1),
      createDate(getToday().getFullYear(), 11, 31),
    ],
  },
  {
    label: "Ano Fiscal Anterior",
    getValue: () => [
      createDate(getToday().getFullYear() - 1, 0, 1),
      createDate(getToday().getFullYear() - 1, 11, 31),
    ],
  },
];

const DateRangeExample: React.FC = () => {
  const today = getToday();

  const onSubmit = (data: IDateForm) => {
    showModal({
      title: "Períodos Selecionados",
      size: "sm",
      content: (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dados brutos (ISO 8601) enviados pelo formulário:
          </p>
          <pre className="text-xs bg-gray-100 dark:bg-black p-4 rounded text-green-600 dark:text-green-400 overflow-auto border border-gray-200 dark:border-gray-800 max-h-60 custom-scrollbar">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ),
    });
  };

  const { formProps, resetSection, handleSubmit } = useForm<IDateForm>({
    id: "date-example",
    onSubmit,
  });

  const handleReset = () => resetSection("", null);

  const handleSimulateEdit = () => {
    const natalStart = "2023-12-20";
    const natalEnd = "2023-12-31";

    resetSection("", {
      enterprise_start: natalStart,
      enterprise_end: natalEnd,
      size_sm_start: "2024-01-01",
      size_sm_end: "2024-01-15",
      mobile_start: "",
      mobile_end: "",
      restricted_start: toISODate(today),
      restricted_end: toISODate(addDays(today, 5)),
      business_start: "",
      business_end: "",
      fiscal_start: "2023-01-01",
      fiscal_end: "2023-06-30",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-100 dark:border-gray-700 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            Date Range Picker v3.0
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Validação de Layouts, Regras de Negócio e Temas.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSimulateEdit}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            <Download size={14} /> Simular Edição
          </button>
          <button
            onClick={handleReset}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <RotateCcw size={14} /> Limpar
          </button>
        </div>
      </div>

      <form {...formProps} className="space-y-12">
        {/* BLOCO 1: LAYOUTS & SIZES */}
        <section className="space-y-6">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
            <Layout size={16} /> Layouts & Tamanhos
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enterprise Dual */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-cyan-500/50 transition-colors">
              <div className="mb-4">
                <h4 className="text-gray-900 dark:text-white font-bold text-sm">
                  1. Enterprise (Dual View)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Exibe 2 meses lado a lado. Ideal para telas largas.
                </p>
              </div>
              <DateRangePicker
                startDateName="enterprise_start"
                endDateName="enterprise_end"
                label="Período Completo"
                months={2}
                showPresets={true}
                required
              />
            </div>

            {/* Variantes de Tamanho */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700 space-y-6">
              <div>
                <h4 className="text-gray-900 dark:text-white font-bold text-sm flex items-center gap-2 mb-2">
                  <Maximize2 size={14} /> Variantes de Tamanho
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Props <code>size="sm" | "md" | "lg"</code>
                </p>

                <div className="space-y-4">
                  <DateRangePicker
                    startDateName="size_sm_start"
                    endDateName="size_sm_end"
                    label="Small (Filtros densos)"
                    size="sm"
                    months={1}
                    showPresets={false}
                  />
                  <DateRangePicker
                    startDateName="size_lg_start"
                    endDateName="size_lg_end"
                    label="Large (Destaque)"
                    size="lg"
                    months={1}
                    showPresets={false}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500/50 transition-colors max-w-sm">
            <h4 className="text-gray-900 dark:text-white font-bold text-sm mb-2 flex items-center gap-2">
              <Smartphone size={14} /> Mobile / Compacto
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              <code>matchInputWidth</code> força o calendário a caber na largura
              do input.
            </p>
            <DateRangePicker
              startDateName="mobile_start"
              endDateName="mobile_end"
              label="Data"
              months={1}
              showPresets={false}
              matchInputWidth
            />
          </div>
        </section>

        {/* BLOCO 2: REGRAS DE NEGÓCIO */}
        <section className="space-y-6">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
            <ShieldAlert size={16} /> Regras & Validação
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded border border-gray-200 dark:border-gray-800">
              <h4 className="text-gray-700 dark:text-gray-300 font-bold text-xs mb-2">
                Restrito (Futuro + 60d)
              </h4>
              <DateRangePicker
                startDateName="restricted_start"
                endDateName="restricted_end"
                label="Agendamento"
                minDate={toISODate(today)}
                maxDate={toISODate(addDays(today, 60))}
              />
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded border border-gray-200 dark:border-gray-800">
              <h4 className="text-gray-700 dark:text-gray-300 font-bold text-xs mb-2">
                Apenas Dias Úteis
              </h4>
              <DateRangePicker
                startDateName="business_start"
                endDateName="business_end"
                label="Prazo de Entrega"
                excludeWeekends
                months={1}
              />
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded border border-gray-200 dark:border-gray-800">
              <h4 className="text-gray-700 dark:text-gray-300 font-bold text-xs mb-2">
                Presets Customizados
              </h4>
              <DateRangePicker
                startDateName="fiscal_start"
                endDateName="fiscal_end"
                label="Ano Fiscal"
                presets={FINANCIAL_PRESETS}
              />
            </div>
          </div>
        </section>

        {/* BLOCO 3: TESTE DE COLISÃO */}
        <section className="space-y-6 pt-8 mt-12 border-t-2 border-dashed border-gray-200 dark:border-gray-800">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase flex items-center gap-2">
            <MousePointer2 size={16} /> Teste de Colisão (Smart Positioning)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            O Popover inverte a direção se estiver nas bordas da tela.
          </p>

          <div className="flex justify-between items-end h-32">
            <div className="w-64">
              <DateRangePicker
                startDateName="edge_left_start"
                endDateName="edge_left_end"
                label="Borda Inferior (Abre CIMA)"
              />
            </div>
            <div className="w-64 text-right">
              <DateRangePicker
                startDateName="edge_right_start"
                endDateName="edge_right_end"
                label="Borda Direita (Abre ESQUERDA)"
                months={2}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-8">
          <button
            type="submit"
            onClick={() => handleSubmit(onSubmit)}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg hover:shadow-green-500/20 transition-all active:scale-95"
          >
            Validar Formulário
          </button>
        </div>
      </form>
    </div>
  );
};

export default DateRangeExample;
