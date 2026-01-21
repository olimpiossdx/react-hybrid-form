import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, ExternalLink, Eye, LayoutList, List, RefreshCw, Search, Shield, Sword, Zap } from 'lucide-react';

import Badge from '../../componentes/badge';
import Button from '../../componentes/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../componentes/card';
import { DataTable, type DataTableColumn, type PaginationState } from '../../componentes/data-table';
import { Input } from '../../componentes/input';
import showModal from '../../componentes/modal/hook';
import { ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '../../componentes/modal/modal';
import { Pagination } from '../../componentes/pagination';
import { api } from '../../service/api';

// ============================================================================
// 1. TIPOS E DADOS MOCKADOS (Exemplo Local)
// ============================================================================

const generateData = () =>
  Array.from({ length: 125 }, (_, i) => ({
    id: i + 1,
    name: `Registro ${i + 1}`,
    status: i % 2 === 0 ? 'Ativo' : 'Pendente',
  }));

const mockData = generateData();

// Tipos para API PokeAPI
type PokemonReference = {
  name: string;
  url: string;
};

type PokemonListItem = {
  id: number;
  name: string;
  url: string;
  image: string;
};

type PokemonDetail = {
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
};

// ============================================================================
// 2. COMPONENTE PRINCIPAL
// ============================================================================

export const TabPagination = () => {
  // Estado Local
  const [localPage, setLocalPage] = useState(1);
  const [localPageSize, setLocalPageSize] = useState(10);

  const paginatedLocalData = useMemo(() => {
    const start = (localPage - 1) * localPageSize;
    const end = start + localPageSize;
    return mockData.slice(start, end);
  }, [localPage, localPageSize]);

  // Estado API (Híbrida)
  const [masterList, setMasterList] = useState<PokemonReference[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  const [pokePagination, setPokePagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });
  const [, setPokeSelected] = useState<(string | number)[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados Visuais
  const [pageSimple, setPageSimple] = useState(1);
  const [pageExtended, setPageExtended] = useState(1);

  // Inicialização
  useEffect(() => {
    const initMasterList = async () => {
      setIsInitializing(true);
      try {
        const res = await api.get<{ results: PokemonReference[] }>('https://pokeapi.co/api/v2/pokemon?limit=2000');
        if (res.isSuccess && res.data) {
          setMasterList(res.data.results);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsInitializing(false);
      }
    };
    initMasterList();
  }, []);

  // Processamento Híbrido
  const { processedData, totalFiltered } = useMemo(() => {
    let filtered = masterList;
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = masterList.filter((p) => p.name.includes(lowerTerm));
    }
    const start = pokePagination.pageIndex * pokePagination.pageSize;
    const end = start + pokePagination.pageSize;
    const sliced = filtered.slice(start, end);
    const enriched = sliced.map((p) => {
      const id = Number(p.url.split('/').filter(Boolean).pop());
      return {
        id,
        name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
        url: p.url,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      };
    });
    return { processedData: enriched, totalFiltered: filtered.length };
  }, [masterList, searchTerm, pokePagination.pageIndex, pokePagination.pageSize]);

  useEffect(() => {
    setPokePagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [searchTerm]);

  const handlePokeRowSelect = useCallback((ids: (string | number)[]) => setPokeSelected(ids), []);
  const handlePokePaginationChange = useCallback((pagination: PaginationState) => setPokePagination(pagination), []);
  const handleSearchChange = useCallback((term: string) => setSearchTerm(term), []);

  // Modal Detail
  const handleViewDetails = (pokemon: PokemonListItem) => {
    showModal({
      size: 'md',
      content: ({ onClose }) => <PokemonDetailModal pokemon={pokemon} onClose={onClose} />,
    });
  };

  const PokemonDetailModal = ({ pokemon, onClose }: { pokemon: PokemonListItem; onClose: () => void }) => {
    const [details, setDetails] = useState<PokemonDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadDetails = async () => {
        const res = await api.get<PokemonDetail>(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
        if (res.isSuccess) {
          setDetails(res.data);
        }
        setLoading(false);
      };
      loadDetails();
    }, [pokemon.id]);

    return (
      <>
        <ModalHeader className="bg-linear-to-r from-blue-600 to-cyan-500 text-white rounded-t-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10">
            <LayoutList size={200} />
          </div>

          <ModalTitle className="text-white flex items-center gap-3 text-3xl relative z-10">
            <span className="font-mono bg-white/20 px-2 py-1 rounded text-xl">#{String(pokemon.id).padStart(3, '0')}</span>
            <span className="font-bold">{pokemon.name}</span>
          </ModalTitle>
          <ModalDescription className="text-gray-700 relative z-10 mt-1">Detalhes táticos e estatísticas de combate.</ModalDescription>
        </ModalHeader>

        <ModalContent className="space-y-6 pt-10 px-6">
          <div className="flex justify-center">
            <div className="w-40 h-40 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-xl -mt-12 relative z-20 hover:scale-105 transition-transform duration-300">
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                alt={pokemon.name}
                className="w-32 h-32 object-contain drop-shadow-lg"
                onError={(e) => (e.currentTarget.src = pokemon.image)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-8 gap-3 text-gray-400">
              <RefreshCw className="animate-spin text-blue-500" size={32} />
              <p>Analisando Pokémon...</p>
            </div>
          ) : details ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-center gap-3">
                {details.types.map((t) => (
                  <Badge
                    key={t.type.name}
                    variant="default"
                    shape="pill"
                    className="capitalize px-4 py-1 text-sm bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    {t.type.name}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/20">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
                    <Activity size={16} /> <span className="text-xs font-bold uppercase">HP</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {details.stats.find((s) => s.stat.name === 'hp')?.base_stat}
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/10 p-3 rounded-xl border border-orange-100 dark:border-orange-900/20">
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
                    <Sword size={16} /> <span className="text-xs font-bold uppercase">Attack</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {details.stats.find((s) => s.stat.name === 'attack')?.base_stat}
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900/20">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                    <Shield size={16} /> <span className="text-xs font-bold uppercase">Defense</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {details.stats.find((s) => s.stat.name === 'defense')?.base_stat}
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-xl border border-yellow-100 dark:border-yellow-900/20">
                  <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mb-1">
                    <Zap size={16} /> <span className="text-xs font-bold uppercase">Speed</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {details.stats.find((s) => s.stat.name === 'speed')?.base_stat}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="text-center w-1/2 border-r border-gray-200 dark:border-gray-700">
                  <span className="block text-xs uppercase text-gray-400 mb-1">Altura</span>
                  <span className="font-semibold text-base">{details.height / 10} m</span>
                </div>
                <div className="text-center w-1/2">
                  <span className="block text-xs uppercase text-gray-400 mb-1">Peso</span>
                  <span className="font-semibold text-base">{details.weight / 10} kg</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-red-500 bg-red-50 rounded-lg">Falha ao carregar detalhes do Pokémon.</div>
          )}
        </ModalContent>

        <ModalFooter className="px-6 pb-6 pt-2">
          <Button onClick={onClose} fullWidth size="lg">
            Fechar
          </Button>
        </ModalFooter>
      </>
    );
  };

  const pokeColumns: DataTableColumn<PokemonListItem>[] = [
    {
      accessorKey: 'id',
      header: '#',
      width: '60px',
      align: 'center',
      cell: (row) => <span className="text-gray-400 font-mono text-xs">#{row.id}</span>,
    },
    {
      accessorKey: 'image',
      header: 'Sprite',
      width: '80px',
      align: 'center',
      cell: (row) => (
        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
          <img src={row.image} alt={row.name} className="w-8 h-8 object-contain" />
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Pokémon',
      cell: (row) => <span className="font-bold text-gray-800 dark:text-white capitalize">{row.name}</span>,
    },
    {
      accessorKey: 'url',
      header: 'Link',
      cell: (row) => (
        <a href={row.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs flex items-center gap-1">
          JSON <ExternalLink size={10} />
        </a>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Ações',
      align: 'right',
      cell: (row) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleViewDetails(row)}
          title="Ver Detalhes"
          className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
          <Eye size={18} />
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 p-6 pb-32">
      <div className="text-center border-b pb-6 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-3">
          <List className="text-blue-600" /> Paginação & Dados
        </h2>
        <p className="text-gray-500 mt-2">Demonstração Responsiva.</p>
      </div>

      {/* SEÇÃO 1: DATA TABLE */}
      <section className="space-y-4">
        {/* Adicionado 'w-full overflow-hidden' ao Card para garantir contenção */}
        <Card className="w-full overflow-hidden">
          <CardHeader className="flex">
            <div>
              <CardTitle>Pokédex Nacional</CardTitle>
              <CardDescription>
                {isInitializing ? 'Carregando banco de dados...' : `Total de ${masterList.length} registros carregados.`}
              </CardDescription>
            </div>
            <div className="flex flex-row w-full max-w-full gap-2 items-end">
              <Input
                placeholder="Buscar Pokémon por nome..."
                leftIcon={<Search className="text-gray-400" size={18} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="filled"
                className="bg-white dark:bg-gray-800 shadow-sm"
                name={''}
              />
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchTerm('');
                  setPokePagination({ ...pokePagination, pageIndex: 0 });
                }}
                leftIcon={<RefreshCw size={16} />}
                className="text-gray-500 w-48">
                Limpar Filtros
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* O próprio DataTable renderiza sua paginação interna responsiva */}
            <DataTable
              data={processedData}
              columns={pokeColumns}
              isLoading={isInitializing}
              onSearchChange={handleSearchChange}
              manualPagination={true}
              rowCount={totalFiltered}
              onPaginationChange={handlePokePaginationChange}
              selectable
              onRowSelect={handlePokeRowSelect}
              density="md"
            />
          </CardContent>
        </Card>
      </section>

      {/* SEÇÃO 2: USO PADRÃO (TABELA SIMPLES + PAGINAÇÃO NO FOOTER) */}
      <section className="space-y-4">
        <Card className="w-full overflow-hidden">
          <CardHeader>
            <CardTitle>Tabela HTML Simples</CardTitle>
            <CardDescription>Paginação desacoplada no CardFooter.</CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {/* Wrapper essencial para responsividade de tabelas HTML puras */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm text-left border-t border-b dark:border-gray-700 min-w-125">
                {' '}
                {/* min-w garante que não esmague em mobile */}
                <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 w-20">ID</th>
                    <th className="px-6 py-3">Nome</th>
                    <th className="px-6 py-3 w-32">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {paginatedLocalData.map((row) => (
                    <tr key={row.id}>
                      <td className="px-6 py-3 font-mono text-xs text-gray-400">#{row.id}</td>
                      <td className="px-6 py-3 font-medium">{row.name}</td>
                      <td className="px-6 py-3">
                        <Badge size="sm" variant={row.status === 'Ativo' ? 'success' : 'warning'}>
                          {row.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>

          {/* FIX: Flex-wrap garante que a paginação quebre linha se o container for pequeno */}
          <CardFooter className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 py-4 flex flex-wrap justify-center sm:justify-end gap-4 w-full">
            <Pagination
              className="w-full sm:w-auto justify-center sm:justify-end"
              currentPage={localPage}
              totalCount={mockData.length}
              pageSize={localPageSize}
              onPageChange={setLocalPage}
              onPageSizeChange={setLocalPageSize}
              pageSizeOptions={[5, 10, 20, 30, 50, 100]}
              variant="outline"
              size="sm"
            />
          </CardFooter>
        </Card>
      </section>

      {/* SEÇÃO 3: MODOS (SIMPLES / EXTENDIDO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Modo Simples</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="text-4xl font-bold text-gray-300">{pageSimple}</div>
            <Pagination
              currentPage={pageSimple}
              totalCount={50}
              pageSize={10}
              onPageChange={setPageSimple}
              mode="simple"
              variant="ghost"
              className="justify-center"
            />
          </CardContent>
        </Card>

        {/* MODO ESTENDIDO - AQUI ESTAVA O PROBLEMA */}
        <Card className="w-full overflow-hidden">
          <CardHeader>
            <CardTitle>Modo Estendido</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8 gap-4 px-2">
            <div className="text-4xl font-bold text-gray-300">{pageExtended}</div>
            {/* Adicionado w-full e flex-wrap para garantir que quebre linha se o card ficar pequeno */}
            <div className="w-full flex justify-center">
              <Pagination
                currentPage={pageExtended}
                totalCount={100}
                pageSize={10}
                onPageChange={setPageExtended}
                mode="extended"
                variant="outline"
                className="justify-center flex-wrap"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default TabPagination;
