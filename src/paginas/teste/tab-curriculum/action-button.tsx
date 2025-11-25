import type { IActionButton } from "./types";

const ActionButtons: React.FC<IActionButton> = ({ onCancel, onEdit, isOtherEditing, isEditingThis }) => (
  <div className="flex justify-end gap-2 mt-2 shrink-0">
    {!isEditingThis
      ? (<button type="button" onClick={onEdit} disabled={isOtherEditing}
        className={`py-1 px-3 rounded text-sm font-medium ${isOtherEditing ? "bg-gray-500 text-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
        Editar
      </button>)
      : null
    }
    {isEditingThis
      ? (<>
        <button type="button" onClick={onCancel} className="py-1 px-3 rounded text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white">
          Cancelar
        </button>
        <button type="submit" className="py-1 px-3 rounded text-sm font-medium bg-green-600 hover:bg-green-700 text-white">
          Salvar
        </button>
      </>)
      : null
    }
  </div>
);

export default ActionButtons;