import React, { useState, useRef, useEffect } from "react";
import { Download, RotateCcw, Users } from "lucide-react";
import Autocomplete, { type IOption } from "../../componentes/autocomplete";
import useForm from "../../hooks/use-form";
import showModal from "../../componentes/modal/hook";

const DEPARTAMENTOS: IOption[] = [
  { value: "dev", label: "Desenvolvimento (DevTeam)" },
  { value: "qa", label: "Quality Assurance (QA)" },
  { value: "produto", label: "Produto & Design" },
  { value: "ops", label: "Operações & Infra" },
  { value: "rh", label: "Recursos Humanos" },
  { value: "fin", label: "Financeiro" },
];

const DADOS_EDICAO = {
  nome_equipe: "Squad Alpha",
  departamento: "dev",
  lider_id: "2",
  urgente: true,
};

const DADOS_VAZIOS = {
  nome_equipe: "",
  departamento: "",
  lider_id: "",
  urgente: false,
};

const AsyncAutocompleteExample = () => {
  const onSubmit = (data: any) => {
    showModal({
      title: "Equipe Cadastrada",
      size: "sm",
      content: (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dados enviados com sucesso:
          </p>
          <pre className="text-xs bg-gray-100 dark:bg-black p-4 rounded text-green-600 dark:text-green-400 overflow-auto border border-gray-200 dark:border-gray-700">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ),
    });
  };

  const { formProps, resetSection, setValidators } = useForm<any>({
    id: "team-form",
    onSubmit,
  });

  const [liderOptions, setLiderOptions] = useState<IOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [shouldFail, setShouldFail] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setValidators({
      validarNome: (val: any) =>
        !val || val.length < 3
          ? { message: "Nome muito curto", type: "error" }
          : undefined,
      validarLider: (val: any) =>
        !val
          ? { message: "Selecione um líder responsável", type: "error" }
          : undefined,
    });
  }, [setValidators]);

  const fetchLideres = async (
    query: string,
    pageNum: number,
    isNewSearch: boolean
  ) => {
    if (isNewSearch && abortControllerRef.current)
      abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (isNewSearch) {
        setIsLoading(true);
        setErrorMsg(undefined);
      } else setIsLoadingMore(true);

      if (shouldFail) throw new Error("Simulação: Falha na conexão.");

      const isIdSearch = /^\d+$/.test(query);
      const endpoint = isIdSearch
        ? `${query}`
        : `?name=${query}&page=${pageNum}`;
      const url = `https://rickandmortyapi.com/api/character/${endpoint}`;

      const response = await fetch(url, { signal: controller.signal });

      if (!response.ok) {
        if (response.status === 404) {
          if (isNewSearch) setLiderOptions([]);
          setHasMore(false);
          return;
        }
        throw new Error("Erro na API");
      }

      const data = await response.json();
      const results = Array.isArray(data) ? data : data.results || [data];

      const newOptions = results.map((char: any) => ({
        value: String(char.id),
        label: char.name,
        disabled: char.status === "Dead",
      }));

      setLiderOptions((prev) => {
        if (isNewSearch) return newOptions;
        const existingIds = new Set(prev.map((o) => o.value));
        return [
          ...prev,
          ...newOptions.filter((o:any) => !existingIds.has(o.value)),
        ];
      });

      if (data.info) {
        setHasMore(!!data.info.next);
        setPage(pageNum);
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error(err);
        setErrorMsg(err.message || "Erro ao carregar lista.");
        if (isNewSearch) setLiderOptions([]);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchLideres("", 1, true);
  }, [shouldFail]);

  const handleSearch = (q: string) => {
    setSearchTerm(q);
    fetchLideres(q, 1, true);
  };
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) fetchLideres(searchTerm, page + 1, false);
  };

  const handleSimulateEdit = async () => {
    await fetchLideres("2", 1, true);
    setTimeout(() => {
      resetSection("", DADOS_EDICAO);
    }, 50);
  };

  const handleReset = () => {
    setSearchTerm("");
    fetchLideres("", 1, true);
    setTimeout(() => {
      resetSection("", DADOS_VAZIOS);
    }, 50);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-100 dark:border-gray-700 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-cyan-400 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Cadastro de Equipe
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Validação de Async, Portal e Estados.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShouldFail(!shouldFail)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded border transition-colors ${
              shouldFail
                ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-200 border-red-200 dark:border-red-800 font-bold"
                : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
            }`}
          >
            {shouldFail ? "🔥 Erro Ativado" : "Simular Erro API"}
          </button>
          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
          <button
            type="button"
            onClick={handleSimulateEdit}
            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-200 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            <Download size={14} /> Editar
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <RotateCcw size={14} /> Limpar
          </button>
        </div>
      </div>

      <form {...formProps} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
            Nome da Equipe *
          </label>
          <input
            type="text"
            name="nome_equipe"
            className="form-input"
            placeholder="Ex: Squad Rocket"
            required
            data-validation="validarNome"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Autocomplete
              name="lider_id"
              label="Líder do Squad (Async)"
              placeholder="Busque por nome..."
              options={liderOptions}
              onSearch={handleSearch}
              onLoadMore={handleLoadMore}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              errorMessage={errorMsg}
              clearable
              required
              validationKey="validarLider"
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 ml-1">
              * Personagens "Dead" são exibidos desabilitados.
            </p>
          </div>

          <div>
            <Autocomplete
              name="departamento"
              label="Departamento (Local)"
              placeholder="Selecione um setor..."
              options={DEPARTAMENTOS}
              required
            />
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
              Testes de Robustez
            </h3>
            <button
              type="button"
              onClick={() => setShowTestModal(true)}
              className="text-xs bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-200 px-3 py-1 rounded border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
            >
              🔍 Testar Portal (Modal)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-900/30 p-4 rounded border border-gray-200 dark:border-gray-800">
            <Autocomplete
              name="campo_disabled"
              label="Teste: Disabled"
              placeholder="Bloqueado..."
              options={DEPARTAMENTOS}
              disabled
              initialValue="dev"
            />
            <Autocomplete
              name="campo_readonly"
              label="Teste: ReadOnly"
              placeholder="Somente leitura..."
              options={DEPARTAMENTOS}
              readOnly
              initialValue="qa"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            type="submit"
            className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95"
          >
            Salvar Cadastro
          </button>
        </div>
      </form>

      {/* MODAL DE TESTE DE PORTAL (Local para demonstração de z-index) */}
      {showTestModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-100 p-4 backdrop-blur-sm"
          onClick={() => setShowTestModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-200 dark:border-gray-600 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Teste de Portal
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              O Autocomplete deve "vazar" o container abaixo.
            </p>

            <div className="border border-red-300 dark:border-red-900/50 p-4 rounded bg-gray-50 dark:bg-gray-900 overflow-hidden relative h-40 mb-4 ring-1 ring-red-200 dark:ring-red-900/30">
              <p className="text-[10px] text-red-500 dark:text-red-400 mb-2 font-mono">
                style="overflow: hidden"
              </p>
              <Autocomplete
                name="modal_test"
                label="Departamento"
                options={DEPARTAMENTOS}
                placeholder="Clique aqui..."
                className="mb-0"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowTestModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-gray-800 dark:text-white text-sm transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsyncAutocompleteExample;
