import React  from 'react';
import type { IOption } from '../../componentes/autocomplete';
import Autocomplete from '../../componentes/autocomplete';
import showModal from '../../componentes/modal/hook';
import useForm from '../../hooks/use-form';

// --- DADOS ESTÁTICOS (Para teste de Autocomplete Local) ---
const DEPARTAMENTOS: IOption[] = [
    { value: 'dev', label: 'Desenvolvimento' },
    { value: 'qa', label: 'Quality Assurance' },
    { value: 'produto', label: 'Produto & Design' },
    { value: 'ops', label: 'Operações' },
];

// --- DADOS DE EDIÇÃO (Mock) ---
const DADOS_EDICAO = {
    nome_equipe: "Squad Alpha",
    departamento: "dev",
    lider_id: "2", // Morty Smith (Precisamos buscar o label na API para exibir)
    urgente: true
};

const AsyncAutocompleteExample = () => {
    const { handleSubmit, formId, resetSection, setValidators } = useForm<any>("team-form");
    
    // --- ESTADOS DO AUTOCOMPLETE ASYNC ---
    const [liderOptions, setLiderOptions] = React.useState<IOption[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingMore, setIsLoadingMore] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);
    
    // Paginação & Controle
    const [page, setPage] = React.useState(1);
    const [hasMore, setHasMore] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    
    // Controle de Teste de Erro
    const [shouldFail, setShouldFail] = React.useState(false);

    const abortControllerRef = React.useRef<AbortController | null>(null);

    // --- VALIDAÇÃO CUSTOMIZADA ---
    React.useEffect(() => {
        setValidators({
            validarNome: (val: string) => !val || val.length < 3 ? { message: "Nome muito curto", type: "error" } : undefined,
            validarLider: (val: string) => !val ? { message: "Selecione um líder responsável", type: "error" } : undefined
        });
    }, [setValidators]);

    // --- BUSCA NA API (Rick and Morty) ---
    const fetchLideres = async (query: string, pageNum: number, isNewSearch: boolean) => {
        // Cancela requests anteriores
        if (isNewSearch && abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            if (isNewSearch) {
                setIsLoading(true);
                setErrorMsg(undefined);
            } else {
                setIsLoadingMore(true);
            }

            // SIMULAÇÃO DE ERRO
            if (shouldFail) {
                throw new Error("Simulação: Falha na conexão com API.");
            }

            // Lógica para buscar por ID (Edição) ou Texto (Busca)
            const isIdSearch = /^\d+$/.test(query);
            const endpoint = isIdSearch ? `${query}` : `?name=${query}&page=${pageNum}`;
            const url = `https://rickandmortyapi.com/api/character/${endpoint}`;
            
            const response = await fetch(url, { signal: controller.signal });

            if (!response.ok) {
                if (response.status === 404) {
                    if (isNewSearch) setLiderOptions([]);
                    setHasMore(false);
                    return;
                }
                throw new Error("Erro desconhecido na API");
            }

            const data = await response.json();
            
            // Normaliza resposta (objeto único vs array de resultados)
            const results = Array.isArray(data) ? data : (data.results || [data]);
            
            const newOptions = results.map((char: any) => ({
                value: String(char.id),
                label: char.name,
                // Adicional: Podemos desabilitar alguns itens para teste
                disabled: char.status === 'Dead' 
            }));

            setLiderOptions(prev => {
                if (isNewSearch) return newOptions;
                // Append sem duplicatas
                const existingIds = new Set(prev.map(o => o.value));
                return [...prev, ...newOptions.filter(o => !existingIds.has(o.value))];
            });

            if (data.info) {
                setHasMore(!!data.info.next);
                setPage(pageNum);
            } else {
                setHasMore(false);
            }

        } catch (err: any) {
            if (err.name !== 'AbortError') {
                console.error(err);
                setErrorMsg(err.message || "Erro ao carregar lista.");
                if (isNewSearch) setLiderOptions([]); // Limpa lista em erro crítico
            }
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    // Inicialização
    React.useEffect(() => {
        fetchLideres("", 1, true);
    }, [shouldFail]); // Recarrega se mudar o status de erro simulado

    // --- HANDLERS ---
    const handleSearch = (q: string) => {
        setSearchTerm(q);
        fetchLideres(q, 1, true);
    };

    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            fetchLideres(searchTerm, page + 1, false);
        }
    };

    const handleSimulateEdit = async () => {
        // 1. Pré-carrega o dado async necessário (Morty - ID 2)
        // Isso garante que o componente tenha a opção disponível para mostrar o label correto
        await fetchLideres("2", 1, true);
        
        // 2. Reseta o formulário com os dados
        resetSection("", DADOS_EDICAO);
    };

    const handleReset = () => {
        resetSection("", null);
        fetchLideres("", 1, true); // Restaura lista padrão
    };

    const onSubmit = (data: any) => {
        showModal({
            title: "Equipe Cadastrada",
            content: () => (
                <pre className="text-xs bg-black p-4 rounded text-green-400 overflow-auto">
                    {JSON.stringify(data, null, 2)}
                </pre>
            )
        });
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-4xl mx-auto">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        Cadastro de Equipe
                        <span className="text-xs font-normal bg-blue-900 text-blue-200 px-2 py-0.5 rounded border border-blue-800">
                            Complex Form
                        </span>
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Valide a interação entre campos nativos, estáticos e assíncronos.
                    </p>
                </div>
                
                {/* BARRA DE CONTROLE DE TESTE */}
                <div className="flex flex-wrap gap-2 bg-gray-900 p-2 rounded border border-gray-700">
                    <button 
                        type="button"
                        onClick={() => setShouldFail(!shouldFail)}
                        className={`px-3 py-1 text-xs rounded border transition-colors ${
                            shouldFail 
                            ? 'bg-red-900 text-red-200 border-red-700 font-bold' 
                            : 'bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-700'
                        }`}
                    >
                        {shouldFail ? '🔥 Erro Ativado' : 'Simular Erro API'}
                    </button>
                    <div className="w-px bg-gray-700 mx-1"></div>
                    <button 
                        type="button"
                        onClick={handleSimulateEdit}
                        className="px-3 py-1 text-xs bg-blue-900 text-blue-200 rounded border border-blue-800 hover:bg-blue-800"
                    >
                        ✎ Editar
                    </button>
                    <button 
                        type="button"
                        onClick={handleReset}
                        className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded border border-gray-600 hover:bg-gray-600"
                    >
                        ↺ Limpar
                    </button>
                </div>
            </div>
            
            <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* 1. INPUT SIMPLES */}
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Nome da Equipe *</label>
                    <input 
                        type="text" 
                        name="nome_equipe" 
                        className="form-input w-full p-2.5 bg-gray-900 border border-gray-600 rounded text-white focus:border-cyan-500 outline-none"
                        placeholder="Ex: Squad Rocket"
                        required
                        data-validation="validarNome"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* 2. AUTOCOMPLETE ASYNC (Rick & Morty) */}
                    <div>
                        <Autocomplete
                            name="lider_id"
                            label="Líder do Squad (Async)"
                            placeholder="Busque por nome (Ex: Rick)..."
                            
                            // Props Async
                            options={liderOptions}
                            onSearch={handleSearch}
                            onLoadMore={handleLoadMore}
                            isLoading={isLoading}
                            isLoadingMore={isLoadingMore}
                            hasMore={hasMore}
                            errorMessage={errorMsg}
                            
                            // Config
                            clearable
                            required
                            validationKey="validarLider"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">
                            * Personagens "Dead" aparecem desabilitados na lista.
                        </p>
                    </div>

                    {/* 3. AUTOCOMPLETE LOCAL (Estático) */}
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

                {/* 4. CHECKBOX DE CONTROLE */}
                <label className="flex items-center gap-3 p-3 bg-gray-900/50 rounded border border-gray-700/50 cursor-pointer">
                    <input 
                        type="checkbox" 
                        name="urgente" 
                        className="w-5 h-5 rounded bg-gray-800 border-gray-600 text-cyan-500 focus:ring-offset-gray-900"
                    />
                    <span className="text-sm text-gray-300">Marcar projeto como <strong>Urgente</strong></span>
                </label>

                {/* BOTÃO DE SUBMIT */}
                <div className="flex justify-end pt-4 border-t border-gray-700">
                    <button type="submit" className="py-2.5 px-8 rounded bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg transition-transform active:scale-95">
                        Salvar Cadastro
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AsyncAutocompleteExample;