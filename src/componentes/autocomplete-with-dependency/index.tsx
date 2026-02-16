import React from 'react';
import Autocomplete, { type IOption } from '../autocomplete';

interface AutocompleteWithDependencyProps {
  name: string;
  label: string;
  baseOptions: IOption[];
  required?: boolean;
  placeholder?: string;
  validationKey?: string;
  className?: string;
  
  // Configuração da dependência
  dependsOn: {
    fieldName: string;
    formId: string;
    getFormValue: () => any;
    filterOptions: (sourceValue: any, baseOptions: IOption[]) => IOption[];
    autoSelectWhen?: (sourceValue: any, currentValue: string | undefined) => string | null;
  };
}

/**
 * Autocomplete com dependência de outro campo.
 * Renderiza isoladamente sem afetar componente pai.
 */
const AutocompleteWithDependency: React.FC<AutocompleteWithDependencyProps> = ({
  name,
  label,
  baseOptions,
  required,
  placeholder,
  validationKey,
  className,
  dependsOn,
}) => {
  const [filteredOptions, setFilteredOptions] = React.useState<IOption[]>(baseOptions);
  
  // Ref para evitar re-criação de callback
  const filterOptionsRef = React.useRef(dependsOn.filterOptions);
  const autoSelectWhenRef = React.useRef(dependsOn.autoSelectWhen);
  
  React.useEffect(() => {
    filterOptionsRef.current = dependsOn.filterOptions;
    autoSelectWhenRef.current = dependsOn.autoSelectWhen;
  }, [dependsOn.filterOptions, dependsOn.autoSelectWhen]);

  React.useEffect(() => {
    const form = document.getElementById(dependsOn.formId) as HTMLFormElement;
    if (!form) return;

    const sourceField = form.querySelector(`[name="${dependsOn.fieldName}"]`) as HTMLInputElement;
    if (!sourceField) return;

    const handleSourceChange = () => {
      const sourceValue = sourceField.value;
      const formData = dependsOn.getFormValue();
      
      // Filtra opções baseado no valor do campo fonte
      const newOptions = filterOptionsRef.current(sourceValue, baseOptions);
      setFilteredOptions(newOptions);

      // Auto-seleção condicional
      if (autoSelectWhenRef.current) {
        const autoSelectValue = autoSelectWhenRef.current(sourceValue, formData[name]);
        
        if (autoSelectValue !== null) {
          const targetField = form.querySelector(`[name="${name}"]`) as HTMLSelectElement;
          
          if (targetField) {
            targetField.value = autoSelectValue;
            const selectedOption = newOptions.find(opt => opt.value === autoSelectValue);
            if (selectedOption) {
              targetField.dataset.label = selectedOption.label;
            }
            targetField.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }
    };

    sourceField.addEventListener('change', handleSourceChange);
    sourceField.addEventListener('input', handleSourceChange);

    // Sincronização inicial
    handleSourceChange();

    return () => {
      sourceField.removeEventListener('change', handleSourceChange);
      sourceField.removeEventListener('input', handleSourceChange);
    };
  }, [dependsOn.fieldName, dependsOn.formId, dependsOn.getFormValue, name, baseOptions]);

  return (
    <Autocomplete
      name={name}
      label={label}
      options={filteredOptions}
      required={required}
      placeholder={placeholder}
      validationKey={validationKey}
      className={className}
    />
  );
};

export default AutocompleteWithDependency;
