import type React from "react";
import { X, File } from "lucide-react";
import { formatBytes } from "../../utils/fileUtils";

export const FileItem: React.FC<any> = ({
  name,
  size,
  isServer,
  isNew,
  onRemove,
}) => (
  <li className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg animate-in slide-in-from-top-2 fade-in shadow-sm">
    <div className="flex items-center gap-3 overflow-hidden">
      <File
        size={18}
        className={isServer ? "text-blue-500" : "text-green-500"}
      />
      <span className="text-sm text-gray-700 dark:text-gray-200 truncate">
        {name}
      </span>
      {size && (
        <span className="text-xs text-gray-400">({formatBytes(size)})</span>
      )}
      {isServer && (
        <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded ml-2">
          Salvo
        </span>
      )}
      {isNew && (
        <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 px-1.5 py-0.5 rounded ml-2">
          Novo
        </span>
      )}
    </div>
    <button
      type="button"
      onClick={onRemove}
      className="text-gray-400 hover:text-red-500 p-1 z-20 relative"
    >
      <X size={16} />
    </button>
  </li>
);
