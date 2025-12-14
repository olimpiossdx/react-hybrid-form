export interface IEscolaridade {
  instituicao: string;
  curso: string;
  ano: number;
}

export interface IExperiencia {
  empresa: string;
  cargo: string;
  anoInicio: number;
  anoFim: number;
}

export interface IDadosAdicionais {
  pretensaoSalarial: number;
  disponibilidadeImediata: boolean;
}

export interface ICurriculumFormValues {
  nome: string;
  email: string;
  resumo: string;
  // Listas Dinâmicas
  escolaridades: IEscolaridade[];
  experiencias: IExperiencia[];
  // Grupo de Checkbox (Array de Strings)
  conhecimentos: string[];
  // Objeto Aninhado
  dadosAdicionais: IDadosAdicionais;
}