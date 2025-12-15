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

/**
 * Interface para arquivos que já existem no servidor (Edição)
 */
export interface ExistingFile {
  id: string | number;
  url: string;
  name: string;
  size?: number;
}

/**
 * Validação de Arquivo (Tamanho e Tipo)
 */
export interface FileError {
  file: File;
  error: 'size' | 'type';
  message: string;
}

/**
 * Valida um único arquivo (usado durante a seleção/onChange)
 */
export const validateFile = (file: File, maxSize?: number, accept?: string): string | null => {
  // 1. Validação de Tamanho
  if (maxSize && file.size > maxSize) {
    return `Arquivo muito grande. Máximo permitido: ${formatBytes(maxSize)}`;
  }

  // 2. Validação de Tipo (MIME)
  if (accept) {
    const acceptedTypes = accept.split(',').map(t => t.trim());
    const fileType = file.type;
    const fileName = file.name;
    
    // Lógica simplificada de verificação (extensão ou mime)
    const isValid = acceptedTypes.some(type => {
      if (type.endsWith('/*')) return fileType.startsWith(type.replace('/*', ''));
      if (type.startsWith('.')) return fileName.toLowerCase().endsWith(type.toLowerCase());
      return fileType === type;
    });

    if (!isValid) return `Tipo de arquivo inválido. Permitidos: ${accept}`;
  }

  return null;
};

/**
 * Regras para validação de lista de arquivos
 */
export interface FileListRules {
  required?: boolean;
  minFiles?: number;
  maxFiles?: number;
  maxTotalSize?: number; // Em bytes
}

/**
 * Valida uma lista de arquivos ou FileList.
 * Útil para validação customizada (setValidators) ou cruzada.
 */
export const validateFileList = (
  files: FileList | null | undefined, 
  rules: FileListRules,
  field?: HTMLElement | null // Permite receber o elemento do DOM para checar atributos
): string | null => {
  const fileArray = files ? Array.from(files) : [];

  // Checa se o campo possui a flag de "arquivos existentes" (Server-side)
  // Isso permite que o validador passe mesmo se o input file estiver vazio (0 novos arquivos)
  const hasExisting = field?.getAttribute('data-has-existing') === 'true';

  // 1. Required
  if (rules.required && fileArray.length === 0 && !hasExisting) {
    return "Este campo é obrigatório.";
  }

  // Se não tem arquivos e não é obrigatório, retorna sucesso
  if (fileArray.length === 0 && !hasExisting) return null;

  // 2. Quantidade Mínima
  if (rules.minFiles && fileArray.length < rules.minFiles && !hasExisting) {
    return `Selecione pelo menos ${rules.minFiles} arquivo(s).`;
  }

  // 3. Quantidade Máxima
  if (rules.maxFiles && fileArray.length > rules.maxFiles) {
    return `O limite é de ${rules.maxFiles} arquivo(s).`;
  }

  // 4. Tamanho Total (Validação Cruzada entre arquivos)
  if (rules.maxTotalSize) {
    const totalSize = fileArray.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > rules.maxTotalSize) {
      return `O tamanho total excede ${formatBytes(rules.maxTotalSize)}. Atual: ${formatBytes(totalSize)}.`;
    }
  }

  return null;
};

/**
 * Remove formatação para envio (limpa literais).
 */
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