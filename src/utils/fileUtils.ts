/**
 * Formata bytes para tamanho legível (Ex: 1.5 MB)
 */
export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export interface ExistingFile {
  id: string | number;
  url: string;
  name: string;
  size?: number;
}

export interface FileError {
  file: File;
  error: 'size' | 'type';
  message: string;
}

export const validateFile = (file: File, maxSize?: number, accept?: string): string | null => {
  if (maxSize && file.size > maxSize) return `Arquivo muito grande. Máximo: ${formatBytes(maxSize)}`;
  if (accept) {
    const acceptedTypes = accept.split(',').map(t => t.trim());
    const fileType = file.type;
    const fileName = file.name;
    const isValid = acceptedTypes.some(type => {
      if (type.endsWith('/*')) return fileType.startsWith(type.replace('/*', ''));
      if (type.startsWith('.')) return fileName.toLowerCase().endsWith(type.toLowerCase());
      return fileType === type;
    });
    if (!isValid) return `Tipo inválido. Permitidos: ${accept}`;
  }
  return null;
};

export interface FileListRules {
  required?: boolean;
  minFiles?: number;
  maxFiles?: number;
  maxTotalSize?: number;
}

/**
 * Validador Unificado (Híbrido)
 * Recebe o valor processado pelo parser do useForm.
 * Aceita o elemento DOM opcional para verificar metadados (data-has-existing).
 */
export const validateFileField = (
  value: any, 
  rules: FileListRules,
  field?: HTMLElement | null 
): string | null => {
  
  let totalCount = 0;
  let newFiles: File[] = [];

  // 1. Tenta extrair dados dependendo do formato recebido
  if (value) {
      if (typeof value === 'object' && 'isHybrid' in value) {
          // Objeto Híbrido (Nosso Componente)
          totalCount = (value.new?.length || 0) + (value.keep?.length || 0);
          newFiles = value.new || [];
      } else if (value instanceof FileList || Array.isArray(value)) {
          // Nativo (FileList ou Array de Files)
          totalCount = value.length;
          newFiles = Array.from(value);
      } else if (typeof value === 'string') {
          // Fallback para String (Input Nativo Value):
          // Se a string não for vazia, significa que o browser tem 1 arquivo selecionado.
          totalCount = value.trim().length > 0 ? 1 : 0;
      }
  }

  // 2. Check de Segurança: Atributo do DOM (Fallback)
  const hasExistingFlag = field?.getAttribute('data-has-existing') === 'true';

  // 3. Validação Required
  if (rules.required) {
      if (totalCount === 0 && !hasExistingFlag) {
          return "Este campo é obrigatório.";
      }
  }

  // Se não tem arquivos, pula o resto
  if (totalCount === 0 && !hasExistingFlag) return null;

  // 4. Quantidade Mínima
  if (rules.minFiles && totalCount < rules.minFiles && !hasExistingFlag) {
      return `Selecione pelo menos ${rules.minFiles} arquivo(s).`;
  }
  
  // 5. Quantidade Máxima
  if (rules.maxFiles && totalCount > rules.maxFiles) {
      return `Máximo de ${rules.maxFiles} arquivo(s).`;
  }

  // 6. Tamanho (Apenas novos)
  if (rules.maxTotalSize) {
    const newSize = newFiles.reduce((acc, f) => acc + f.size, 0);
    if (newSize > rules.maxTotalSize) return `Novos arquivos excedem ${formatBytes(rules.maxTotalSize)}.`;
  }

  return null;
};

export const unmaskValue = (value: string, type?: string): string => {
  if (type === 'currency') {
      const raw = value.replace(/\D/g, '');
      if (!raw) return '';
      const padded = raw.padStart(3, '0');
      const integer = padded.slice(0, -2);
      const decimal = padded.slice(-2);
      return `${BigInt(integer)}.${decimal}`;
  }
  return value.replace(/[^a-zA-Z0-9]/g, '');
};