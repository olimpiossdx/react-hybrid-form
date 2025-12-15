import React  from 'react';
import { UploadCloud, X, File } from 'lucide-react';
import { formatBytes, validateFile, type ExistingFile } from '../../utils/fileUtils';
import { toast } from '../toast';
import type { IFileInputProps } from './props';
import { FileItem } from './file-item';


const FileInput: React.FC<IFileInputProps> = ({
  name, label, multiple, accept, maxSize, initialFiles = [], required, disabled, className = "", ...rest
}) => {
  const [newFiles, setNewFiles] = React.useState<File[]>([]);
  const [serverFiles, setServerFiles] = React.useState<ExistingFile[]>(initialFiles);
  const [isDragOver, setIsDragOver] = React.useState(false);
  
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // Ref para guardar a última versão processada das props (evita loop)
  const prevInitialFilesRef = React.useRef<string>(JSON.stringify(initialFiles));

  // Sincronia de Props Inteligente (Deep Compare Simplificado)
  React.useEffect(() => {
    const currentString = JSON.stringify(initialFiles);
    
    // Só atualiza o estado se o CONTEÚDO dos arquivos mudou, ignorando referências
    if (prevInitialFilesRef.current !== currentString) {
        setServerFiles(initialFiles);
        prevInitialFilesRef.current = currentString;
    }
  }, [initialFiles]);

  const updateNativeInput = (files: File[]) => {
    if (!inputRef.current) return;
    const dt = new DataTransfer();
    files.forEach(f => dt.items.add(f));
    inputRef.current.files = dt.files;
    // Sem dispatchEvent para evitar loops
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (!e.target.files) return;

    const rawFiles = Array.from(e.target.files);
    // Ignora reset vazio se já temos arquivos novos (proteção contra cancelamento do dialog)
    if (rawFiles.length === 0 && newFiles.length > 0) return; 

    const validFiles: File[] = [];
    const errors: string[] = [];

    rawFiles.forEach(file => {
      const error = validateFile(file, maxSize, accept);
      if (error) errors.push(`${file.name}: ${error}`);
      else validFiles.push(file);
    });

    if (errors.length > 0) toast.warning(errors[0]);

    const finalFiles = multiple ? [...newFiles, ...validFiles] : validFiles;
    
    setNewFiles(finalFiles);
    updateNativeInput(finalFiles);
    
    if (!multiple && validFiles.length > 0) {
        setServerFiles([]); 
    }
  };

  const removeNewFile = (index: number) => {
    const updated = newFiles.filter((_, i) => i !== index);
    setNewFiles(updated);
    updateNativeInput(updated);
  };

  const removeServerFile = (id: string | number) => {
    setServerFiles(prev => prev.filter(f => f.id !== id));
  };

  const hasFiles = newFiles.length > 0 || serverFiles.length > 0;
  const isSinglePreview = !multiple && hasFiles;

  return (
    <div className={`w-full ${className}`}>
      {label && (
         <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
         </label>
      )}

      <div 
        className={`
            relative flex flex-col items-center justify-center w-full transition-all duration-200 border-2 border-dashed rounded-lg cursor-pointer overflow-hidden
            ${isDragOver ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}
            ${isSinglePreview ? 'p-0 border-solid border-cyan-500' : 'p-6'}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }} 
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragOver(false); }}
      >
        <input 
            ref={inputRef}
            type="file" 
            name={name}
            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
            onChange={handleFileChange}
            multiple={multiple}
            accept={accept}
            required={required && !hasFiles} 
            disabled={disabled}
            {...rest}
        />

        {isSinglePreview ? (
            <div className="flex items-center justify-between w-full p-4 bg-cyan-50 dark:bg-cyan-900/20">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shrink-0">
                        <File className="text-cyan-600 dark:text-cyan-400" size={24} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {newFiles[0]?.name || serverFiles[0]?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                             {newFiles[0] ? formatBytes(newFiles[0].size) : "Arquivo Salvo"}
                        </p>
                    </div>
                </div>
                <button 
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setNewFiles([]);
                        setServerFiles([]);
                        updateNativeInput([]);
                    }} 
                    className="relative z-20 p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        ) : (
            <div className="text-center pointer-events-none">
                <div className="flex justify-center mb-3">
                     <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-400 dark:text-gray-300">
                        <UploadCloud size={24} />
                     </div>
                </div>
                <p className="mb-1 text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Clique para enviar</span> ou arraste
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {accept ? accept.replace(/,/g, ', ') : 'Qualquer arquivo'} {maxSize && `(Máx. ${formatBytes(maxSize)})`}
                </p>
            </div>
        )}
      </div>

      {multiple && hasFiles && (
          <ul className="mt-4 space-y-2">
              {serverFiles.map((file) => (
                  <FileItem 
                    key={`server-${file.id}`} 
                    name={file.name} 
                    size={file.size} 
                    isServer 
                    onRemove={() => removeServerFile(file.id)} 
                  />
              ))}
              {newFiles.map((file, idx) => (
                  <FileItem 
                    key={`new-${idx}`} 
                    name={file.name} 
                    size={file.size} 
                    isNew 
                    onRemove={() => removeNewFile(idx)} 
                  />
              ))}
          </ul>
      )}
    </div>
  );
};

export default FileInput;