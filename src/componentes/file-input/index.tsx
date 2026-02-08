import React from 'react';
import { CheckCircle, File, Image as ImageIcon, UploadCloud, X } from 'lucide-react';

import { type ExistingFile, formatBytes, validateFile } from '../../utils/fileUtils';
import { toast } from '../toast';

interface FileInputProps {
  name: string;
  label?: string;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  defaultValue?: ExistingFile[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  'data-validation'?: string;
}

const FileInput: React.FC<FileInputProps> = ({
  name,
  label,
  multiple,
  accept,
  maxSize,
  defaultValue = [],
  required,
  disabled,
  className = '',
  ...rest
}) => {
  const [newFiles, setNewFiles] = React.useState<File[]>([]);
  const [serverFiles, setServerFiles] = React.useState<ExistingFile[]>(defaultValue);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);

  // Controle de estabilidade para props (evita loop infinito)
  const prevInitialFilesRef = React.useRef<string>(JSON.stringify(defaultValue));

  React.useEffect(() => {
    const currentString = JSON.stringify(defaultValue);
    if (prevInitialFilesRef.current !== currentString) {
      setServerFiles(defaultValue);
      prevInitialFilesRef.current = currentString;
    }
  }, [defaultValue]);

  // Sincronia DOM (Reset Externo + Flags)
  React.useEffect(() => {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    const handleExternalInput = () => {
      if (input.dataset.initial) {
        try {
          const files = JSON.parse(input.dataset.initial);
          setServerFiles(files);
          setNewFiles([]);
          input.dataset.keep = JSON.stringify(files);
          if (files.length > 0) {
            input.removeAttribute('required');
          }
        } catch (e) {
          console.error('Erro ao parsear arquivos iniciais:', e);
          /* empty */
        }
      } else if (!input.value) {
        setServerFiles([]);
        setNewFiles([]);
        delete input.dataset.keep;
        if (required) {
          input.setAttribute('required', 'true');
        }
      }
    };

    input.addEventListener('input', handleExternalInput);
    return () => input.removeEventListener('input', handleExternalInput);
  }, [required]);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.dataset.keep = JSON.stringify(serverFiles);
      const hasAny = newFiles.length > 0 || serverFiles.length > 0;
      inputRef.current.dataset.hasExisting = hasAny.toString();

      if (hasAny) {
        inputRef.current.removeAttribute('required');
      } else if (required) {
        inputRef.current.setAttribute('required', 'true');
      }
    }
  }, [serverFiles, newFiles, required]);

  const updateNativeInput = (files: File[]) => {
    if (!inputRef.current) {
      return;
    }
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    inputRef.current.files = dt.files;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }
    const rawFiles = Array.from(e.target.files || []);
    if (rawFiles.length === 0 && newFiles.length > 0) {
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    rawFiles.forEach((file) => {
      const error = validateFile(file, maxSize, accept);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      toast.warning(errors[0]);
    }

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
    setServerFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const hasFiles = newFiles.length > 0 || serverFiles.length > 0;
  const isSinglePreview = !multiple && hasFiles;
  const isNativelyRequired = required && !hasFiles;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`relative flex flex-col items-center justify-center w-full transition-all duration-200 border-2 border-dashed rounded-lg cursor-pointer overflow-hidden ${isDragOver ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'} ${isSinglePreview ? 'p-0 border-solid border-cyan-500' : 'p-6'}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}>
        <input
          ref={inputRef}
          type="file"
          name={name}
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
          onChange={handleFileChange}
          multiple={multiple}
          accept={accept}
          disabled={disabled}
          required={isNativelyRequired}
          {...rest}
        />

        {isSinglePreview ? (
          <div className="flex items-center justify-between w-full p-4 bg-cyan-50 dark:bg-cyan-900/20">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shrink-0">
                <ImageIcon className="text-cyan-600 dark:text-cyan-400" size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{newFiles[0]?.name || serverFiles[0]?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{newFiles[0] ? formatBytes(newFiles[0].size) : 'Arquivo Salvo'}</p>
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
              className="relative z-20 p-1 text-gray-400 hover:text-red-500">
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
          {serverFiles.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 overflow-hidden">
                <CheckCircle size={18} className="text-blue-500 shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{f.name}</span>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded ml-2">
                  Salvo
                </span>
              </div>
              <button type="button" onClick={() => removeServerFile(f.id)} className="text-gray-400 hover:text-red-500 p-1 z-20 relative">
                <X size={16} />
              </button>
            </li>
          ))}
          {newFiles.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 overflow-hidden">
                <File size={18} className="text-green-500 shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{f.name}</span>
                <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 px-1.5 py-0.5 rounded ml-2">
                  Novo
                </span>
              </div>
              <button type="button" onClick={() => removeNewFile(i)} className="text-gray-400 hover:text-red-500 p-1 z-20 relative">
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default FileInput;
