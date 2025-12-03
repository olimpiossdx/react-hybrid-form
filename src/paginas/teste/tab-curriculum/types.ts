
// --- Tipos para o Currículo ---
export interface IEscolaridade {
  instituicao: string;
  curso: string;
  ano: number; // number para facilitar input type="number"
}

export interface IExperiencia {
  empresa: string;
  cargo: string;
  anoInicio: number;
  anoFim: number;
  descricao?: string;
}

export interface IDadosAdicionais {
  pretensaoSalarial: number;
  disponibilidadeImediata: boolean;
}

export interface ICurriculumFormValues {
  nome: string;
  email: string;
  resumo: string;
  escolaridades: IEscolaridade[];
  experiencias: IExperiencia[];
  conhecimentos: string[]; // Checkbox Group (Array de strings)
  adicionais: IDadosAdicionais;
}

export interface IActionButton {
  sectionId: string;
  prefix: string;
  onCancel: () => void;
  onEdit: () => void;
  isOtherEditing: boolean;
  isEditingThis: boolean;
};


export interface ISectionProps {
  editingId: string | null;
  handleCancel: (_: string, prefix: string) => void;
  handleEdit: (id: string, prefix: string) => void
};