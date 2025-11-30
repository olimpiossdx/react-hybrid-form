import React from "react";
import { syncCheckboxGroup, initializeCheckboxMasters, setNativeValue, setNativeChecked } from "../../utils/utilities";
import type { FieldListenerMap, ValidatorMap, FormField, Path, PathValue } from "./props";
import { getFormFields, parseFieldValue, getRelativePath, setNestedValue, getNestedValue } from "./utilities";

/**
 * Hook principal para gerenciamento de formulários híbridos (Uncontrolled + React).
 * * Filosofia de Arquitetura:
 * 1. **Performance:** O estado vive no DOM. Digitar não causa re-renders.
 * 2. **Híbrido:** Suporta validação nativa do browser + validação customizada JS.
 * 3. **Inteligente:** Detecta automaticamente grupos de checkboxes e arrays baseados no 'name'.
 * * @param providedId ID opcional para o formulário. Se não fornecido, gera um ID único.
 */
const useForm = <FV extends Record<string, any>>(providedId?: string) => {
  // --- ESTADO & REFS ---
  const formId = providedId || React.useId();
  const formRef = React.useRef<HTMLFormElement>(null);

  // Armazena listeners de eventos para removê-los corretamente ao desmontar
  const fieldListeners = React.useRef<FieldListenerMap>(new Map());

  // Mapa de funções de validação customizadas
  const validators = React.useRef<ValidatorMap<FV>>({});

  /**
   * Helper: Conta quantos campos compartilham o mesmo 'name'.
   * Usado para decidir se um checkbox deve ser tratado como Booleano (único) ou Array (grupo).
   */
  const countFieldsByName = (form: HTMLElement, name: string): number => {
    return form.querySelectorAll(`[name="${name}"]`).length;
  };

  /**
   * Registra regras de validação customizadas.
   * As regras são executadas no evento 'change', 'blur' e 'submit'.
   */
  const setValidators = React.useCallback((newValidators: ValidatorMap<FV>) => {
    validators.current = newValidators;
  }, []);

  // =========================================================================
  // 1. LEITURA DE DADOS (DOM -> JSON)
  // =========================================================================

  /**
   * Extrai os dados do formulário convertendo para um objeto JSON estruturado.
   * Suporta aninhamento (dot notation) e arrays.
   * * @param namePrefix Prefixo opcional para extrair apenas uma seção dos dados.
   */
 const getValue = React.useCallback((namePrefix?: string): any => {
    const form = formRef.current;
    if (!form) return namePrefix ? undefined : ({} as FV);

    const fields = getFormFields(form, namePrefix);

    // Caso Especial: Se o prefixo for o nome exato de um campo único
    if (namePrefix) {
      const exactMatch = fields.find(f => f.name === namePrefix);
      if (exactMatch) {
         if (exactMatch instanceof HTMLInputElement && exactMatch.type === 'checkbox') {
             // Se for único, retorna valor direto (Bool ou String)
             if (countFieldsByName(form, exactMatch.name) === 1) {
                 const hasValue = exactMatch.hasAttribute('value') && exactMatch.value !== 'on';
                 return exactMatch.checked ? (hasValue ? exactMatch.value : true) : false;
             }
         }
         return parseFieldValue(exactMatch);
      }
    }

    const formData = {};
    const processedNames = new Set<string>(); // Evita processar o mesmo grupo múltiplas vezes

    // Loop Principal de Extração
    fields.forEach(field => {
      const relativePath = getRelativePath(field.name, namePrefix);
      
      // Ignora campos fora do escopo ou já processados (grupos)
      if (!relativePath || processedNames.has(field.name)) return;

      // Lógica Específica para Checkboxes
      if (field instanceof HTMLInputElement && field.type === 'checkbox') {
        const count = countFieldsByName(form, field.name);

        if (count > 1) {
          // MODO GRUPO: Coleta todos os marcados como Array de Strings
          const allChecked = form.querySelectorAll<HTMLInputElement>(`input[type="checkbox"][name="${field.name}"]:checked`);
          const values = Array.from(allChecked).map(cb => cb.value);
          
          setNestedValue(formData, relativePath, values);
          processedNames.add(field.name); // Marca para pular os irmãos
        } else {
          // MODO ÚNICO: Retorna Valor ou Booleano
          if (field.checked) {
             const hasExplicitValue = field.hasAttribute('value') && field.value !== 'on';
             setNestedValue(formData, relativePath, hasExplicitValue ? field.value : true);
          } else {
             setNestedValue(formData, relativePath, false);
          }
        }
        return;
      }

      // Padrão para outros inputs (Text, Radio, Select...)
      const value = parseFieldValue(field);
      setNestedValue(formData, relativePath, value);
    });

    return formData;
  }, []) as {
    // Sobrecarga 1: Sem argumentos -> Retorna o objeto completo tipado
    (): FV;
    // Sobrecarga 2: Com caminho válido -> Infere o tipo exato
    <P extends Path<FV>>(namePrefix: P): PathValue<FV, P>;
    // Sobrecarga 3: Com string genérica -> Retorna any
    (namePrefix: string): any;
  };

  // =========================================================================
  // 2. VALIDAÇÃO (Regras Customizadas JS)
  // =========================================================================

  /**
   * Executa todas as validações customizadas e aplica setCustomValidity no DOM.
   * Isso permite que o navegador exiba os balões de erro nativos.
   */
  const revalidateAllCustomRules = React.useCallback(() => {
    const form = formRef.current;
    if (!form) return;

    const formValues = getValue() as FV;
    const validatorFunctions = validators.current;

    // 1. Aplica validadores customizados registrados
    Object.keys(validatorFunctions).forEach(validationKey => {
      const validate = validatorFunctions[validationKey];
      if (!validate) return;

      // Busca campos que solicitaram esta validação via data-validation="..."
      const fieldsToValidate = form.querySelectorAll<FormField>(`[name][data-validation="${validationKey}"]:not(:disabled)`);

      fieldsToValidate.forEach(field => {
        field.setCustomValidity(''); // Limpa erro anterior antes de validar

        const fieldValue = getNestedValue(formValues, field.name);
        const result = validate(fieldValue, field, formValues);

        if (typeof result === 'string') {
          field.setCustomValidity(result);
        } else if (result?.type === 'error') {
          field.setCustomValidity(result.message);
        }
      });
    });

    // 2. Limpa validadores de campos que não têm regras (Fallback de segurança)
    const fieldsWithoutCustomValidation = form.querySelectorAll<FormField>(
      'input[name]:not([data-validation]), select[name]:not([data-validation]), textarea[name]:not([data-validation])'
    );
    fieldsWithoutCustomValidation.forEach(field => {
      if (field.validity.valid) field.setCustomValidity('');
    });
  }, [getValue]);

  // =========================================================================
  // 3. INTERAÇÃO & EVENTOS
  // =========================================================================

  /**
   * Handler centralizado para eventos de interação (change/blur).
   */
  const handleFieldInteraction = React.useCallback((event: Event) => {
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) return;

    // A. Feedback Visual (CSS .is-touched para estilização)
    target.classList.add('is-touched');

    // B. Sincronia Automática de Checkbox Group (Mestre/Detalhe)
    // BLINDAGEM: Só executa no evento 'change' real. 
    // Ignora 'blur' para evitar resets acidentais de estado visual.
    if (event.type === 'change' && target instanceof HTMLInputElement && target.type === 'checkbox') {
      if (formRef.current) {
        syncCheckboxGroup(target, formRef.current);
      }
    }

    // C. Revalidação em tempo real para feedback imediato ao usuário
    revalidateAllCustomRules();
  }, [revalidateAllCustomRules]);

  // =========================================================================
  // 4. ESCRITA DE DADOS (Reset / Load Data)
  // =========================================================================

  /**
   * Preenche o formulário com dados (ex: vindos de uma API) ou reseta.
   * * @param namePrefix Prefixo para resetar apenas uma seção (ou "" para tudo).
   * @param originalValues Objeto de dados para preencher. Se null/undefined, reseta para default HTML.
   */
  const resetSection = React.useCallback((namePrefix: string, originalValues: any) => {
    const form = formRef.current;
    if (!form) return;

    const fields = getFormFields(form, namePrefix);

    fields.forEach(field => {
      const relativePath = getRelativePath(field.name, namePrefix);
      let valueToApply = undefined;

      if (originalValues) {
        valueToApply = relativePath ? getNestedValue(originalValues, relativePath) : undefined;
        // Fallback para estruturas planas se relativePath falhar
        if (valueToApply === undefined && !relativePath) {
          valueToApply = getNestedValue(originalValues, field.name);
        }
      }

      // Lógica de Aplicação Segura (Respeita tipos de input)
      if (field instanceof HTMLInputElement && (field.type === 'checkbox' || field.type === 'radio')) {
        let shouldCheck = false;
        if (valueToApply !== undefined) {
          if (field.type === 'checkbox' && Array.isArray(valueToApply)) {
            // Grupo: Marca se valor existe no array
            shouldCheck = valueToApply.includes(field.value);
          } else if (field.type === 'checkbox' && typeof valueToApply === 'boolean') {
            // Flag: Marca booleano
            shouldCheck = valueToApply;
          } else {
            // Radio/Valor Específico: Marca se coincidir
            shouldCheck = field.value === String(valueToApply);
          }
        } else {
          // Reset para default HTML (limpeza)
          shouldCheck = field.defaultChecked;
        }
        // Usa o Bypass sem clique para evitar toggle acidental durante o load
        setNativeChecked(field, shouldCheck);
      } else {
        // Reset de Texto/Select
        const newValue = String(valueToApply ?? (field as any).defaultValue ?? '');
        setNativeValue(field, newValue);
      }

      field.classList.remove('is-touched');
    });

    // FIX CRÍTICO: setTimeout garante que o update visual dos Mestres ocorra
    // APÓS todos os eventos de change individuais terem sido processados.
    setTimeout(() => {
      initializeCheckboxMasters(form);
    }, 0);

  }, []);

  // =========================================================================
  // 5. OBSERVERS & LISTENERS (Infraestrutura)
  // =========================================================================

  const addFieldInteractionListeners = (field: HTMLElement): void => {
    // Detecta inputs "Mestres" (sem name, mas com data-checkbox-master)
    const isMaster = field.hasAttribute('data-checkbox-master');
    const allowedTypes = [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement];

    if (!allowedTypes.some(type => field instanceof type)) return;

    // Adiciona apenas se tiver nome ou for mestre, e se ainda não tiver listener
    if (((field as any).name || isMaster) && !fieldListeners.current.has(field)) {
      const listeners = { blur: handleFieldInteraction, change: handleFieldInteraction };
      field.addEventListener('blur', listeners.blur);
      field.addEventListener('change', listeners.change);
      fieldListeners.current.set(field, listeners);
    }
  };

  const removeFieldInteractionListeners = (field: HTMLElement): void => {
    const listeners = fieldListeners.current.get(field);
    if (listeners) {
      field.removeEventListener('blur', listeners.blur);
      field.removeEventListener('change', listeners.change);
      fieldListeners.current.delete(field);
    }
  };

  /**
   * Configura o MutationObserver para detectar campos adicionados dinamicamente
   * e anexar listeners automaticamente. Garante escalabilidade em listas infinitas.
   */
  const setupDOMMutationObserver = (form: HTMLFormElement): () => void => {
    // 1. Inicializa listeners existentes
    const initialFields = getFormFields(form);
    initialFields.forEach(addFieldInteractionListeners);

    // Captura Mestres isolados
    form.querySelectorAll('input[type="checkbox"][data-checkbox-master]').forEach(cb => {
      if (cb instanceof HTMLElement) addFieldInteractionListeners(cb);
    });

    initializeCheckboxMasters(form);

    const observer = new MutationObserver((mutations) => {
      let needsReinitMasters = false;

      mutations.forEach((mutation) => {
        if (mutation.type !== 'childList') return;

        // Otimização: Processa apenas nós adicionados/removidos (evita scan total)
        mutation.addedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) return;

          addFieldInteractionListeners(node);
          getFormFields(node as any).forEach(addFieldInteractionListeners);

          // Se entrou checkbox novo, marca flag para recalcular mestres
          if (node.querySelector('input[type="checkbox"]') || (node instanceof HTMLInputElement && node.type === 'checkbox')) {
            needsReinitMasters = true;
          }
        });

        mutation.removedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) return;
          removeFieldInteractionListeners(node);
          getFormFields(node as any).forEach(removeFieldInteractionListeners);
        });
      });

      if (needsReinitMasters) {
        initializeCheckboxMasters(form);
      }
    });

    observer.observe(form, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      fieldListeners.current.forEach((listeners, field) => {
        if (field?.removeEventListener) {
          field.removeEventListener('blur', listeners.blur);
          field.removeEventListener('change', listeners.change);
        }
      });
      fieldListeners.current.clear();
    };
  };

  // =========================================================================
  // 6. SUBMIT
  // =========================================================================

  const handleSubmit = React.useCallback((onValid: (data: FV) => void) =>
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = formRef.current;
      if (!form) return;

      const allFields = getFormFields(form);
      allFields.forEach(field => field.classList.add('is-touched'));

      revalidateAllCustomRules();

      // Timeout(0) joga a validação para o final do event loop,
      // garantindo que o DOM processou as custom validities antes do check nativo.
      setTimeout(() => {
        if (!formRef.current) return;
        const isValid = formRef.current.checkValidity();

        if (!isValid) {
          focusFirstInvalidField(form);
          form.reportValidity();
        } else {
          onValid(getValue() as FV);
        }
      }, 0);
    }, [getValue, revalidateAllCustomRules]);

  /**
   * Foca no primeiro campo inválido.
   * Suporta componentes customizados (Shadow Select/Anchor Input) buscando
   * elementos visuais focáveis próximos ao input oculto.
   */
  const focusFirstInvalidField = (form: HTMLFormElement): void => {
    const activeSection = form.querySelector('fieldset:not(:disabled)') || form;
    const firstInvalid = activeSection.querySelector<HTMLElement>(':invalid');
    if (!firstInvalid) return;

    const focusableSibling = firstInvalid.parentElement?.querySelector<HTMLElement>(
      'input:not([type="hidden"]), select, textarea, [tabindex="0"]'
    );

    if (focusableSibling) {
      focusableSibling.focus();
    } else {
      firstInvalid.focus();
    }
  };

  // Inicialização do Hook
  React.useLayoutEffect(() => {
    const form = document.getElementById(formId) as HTMLFormElement;
    if (!form) return;
    formRef.current = form;
    const cleanup = setupDOMMutationObserver(form);
    return cleanup;
  }, [formId]);

  return {
    handleSubmit,
    setValidators,
    formId,
    resetSection,
    getValue
  };
};

export default useForm;