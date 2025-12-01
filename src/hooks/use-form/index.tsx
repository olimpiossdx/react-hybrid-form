import React from "react";
import { syncCheckboxGroup, initializeCheckboxMasters, setNativeValue, setNativeChecked } from "../../utils/utilities";
import type { FieldListenerMap, ValidatorMap, FormField, Path, PathValue } from "./props";
import { getFormFields, parseFieldValue, getRelativePath, setNestedValue, getNestedValue } from "./utilities";

/**
 * Hook principal para gerenciamento de formulários com arquitetura Híbrida.
 * * @template FV - Tipo genérico representando o formato dos dados do formulário (Record<string, any>).
 * @param providedId - (Opcional) ID do formulário HTML. Se não fornecido, gera um ID único.
 */
const useForm = <FV extends Record<string, any>>(providedId?: string) => {
  // Identidade e Referências
  const formId = providedId || React.useId();
  const formRef = React.useRef<HTMLFormElement>(null);
  
  // Armazena listeners de eventos para cleanup correto
  const fieldListeners = React.useRef<FieldListenerMap>(new Map());
  const validators = React.useRef<ValidatorMap<FV>>({});

  // Mapa de Timers para a estratégia "Smart Debounce" de validação
  const debounceMap = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  /**
   * Helper: Conta ocorrências de campos com o mesmo nome.
   * Usado para distinguir Checkbox Único (Boolean) de Checkbox Group (Array).
   */
  const countFieldsByName = (form: HTMLElement, name: string): number => {
    return form.querySelectorAll(`[name="${name}"]`).length;
  };

  /**
   * Registra regras de validação customizadas.
   * Essas regras rodam em tempo real (debounce) e no submit.
   */
  const setValidators = React.useCallback((newValidators: ValidatorMap<FV>) => {
    validators.current = newValidators;
  }, []);

  // =========================================================================
  // 1. LEITURA DE DADOS (DOM -> JSON)
  // =========================================================================

  // Implementação interna do getValue
  const getValueImpl = React.useCallback((namePrefix?: string): any => {
    const form = formRef.current;
    if (!form) return namePrefix ? undefined : ({} as FV);

    const fields = getFormFields(form, namePrefix);

    // Otimização: Busca exata se um prefixo específico foi passado (ex: getValue('user.name'))
    if (namePrefix) {
      const exactMatch = fields.find(f => f.name === namePrefix);
      if (exactMatch) {
         if (exactMatch instanceof HTMLInputElement && exactMatch.type === 'checkbox') {
             // Se for checkbox único, retorna valor direto
             if (countFieldsByName(form, exactMatch.name) === 1) {
                 const hasValue = exactMatch.hasAttribute('value') && exactMatch.value !== 'on';
                 return exactMatch.checked ? (hasValue ? exactMatch.value : true) : false;
             }
         }
         return parseFieldValue(exactMatch);
      }
    }

    const formData = {};
    const processedNames = new Set<string>();

    fields.forEach(field => {
      const relativePath = getRelativePath(field.name, namePrefix);
      if (!relativePath || processedNames.has(field.name)) return;

      // Lógica para Checkbox Groups (Arrays) vs Checkbox Único
      if (field instanceof HTMLInputElement && field.type === 'checkbox') {
        const count = countFieldsByName(form, field.name);

        if (count > 1) {
          // MODO GRUPO: Coleta todos os marcados como Array
          const allChecked = form.querySelectorAll<HTMLInputElement>(`input[type="checkbox"][name="${field.name}"]:checked`);
          const values = Array.from(allChecked).map(cb => cb.value);
          setNestedValue(formData, relativePath, values);
          processedNames.add(field.name);
        } else {
          // MODO ÚNICO: Booleano ou Valor
          if (field.checked) {
             const hasExplicitValue = field.hasAttribute('value') && field.value !== 'on';
             setNestedValue(formData, relativePath, hasExplicitValue ? field.value : true);
          } else {
             setNestedValue(formData, relativePath, false);
          }
        }
        return;
      }

      const value = parseFieldValue(field);
      setNestedValue(formData, relativePath, value);
    });

    return formData;
  }, []);

  /**
   * Extrai os dados do formulário.
   * Possui sobrecargas para inferência de tipo inteligente baseada no caminho (Path).
   */
  const getValue = getValueImpl as {
    /** Retorna todos os dados do formulário tipados. */
    (): FV;
    /** Retorna o valor de um campo específico com o tipo correto (string, number, etc). */
    <P extends Path<FV>>(namePrefix: P): PathValue<FV, P>;
    /** Fallback para strings dinâmicas. */
    (namePrefix: string): any;
  };

  // ============ HELPER DE VALIDAÇÃO ============
  
  const validateFieldInternal = (field: FormField, formValues: FV): string => {
      const validateFn = validators.current[field.dataset.validation || ''];
      field.setCustomValidity(''); // Reseta estado nativo
      
      // 1. Regras Nativas (HTML5)
      if (!field.checkValidity()) {
          return field.validationMessage;
      }

      // 2. Regras Customizadas (JS)
      if (validateFn) {
          const fieldValue = getNestedValue(formValues, field.name);
          const result = validateFn(fieldValue, field, formValues);
          
          if (result) {
              const message = typeof result === 'string' ? result : result.message;
              field.setCustomValidity(message);
              return message;
          }
      }

      return '';
  };

  // ============ VALIDAÇÃO EM MASSA (SUBMIT) ============
  
  const revalidateAllCustomRules = React.useCallback(() => {
    const form = formRef.current;
    if (!form) return;
    const formValues = getValue() as FV;

    const allFields = getFormFields(form);
    allFields.forEach(field => {
        if (field.disabled) return;
        // Apenas valida silenciosamente para atualizar estado :invalid
        validateFieldInternal(field, formValues);
    });
  }, [getValue]);

  // ============ INTERAÇÃO & SMART DEBOUNCE ============
  
  const handleFieldInteraction = React.useCallback((event: Event) => {
    const target = event.currentTarget;
    if(!(target instanceof HTMLElement)) return;

    // Sincronia Imediata de Checkbox Group (Mestre/Detalhe)
    if (event.type === 'change' && target instanceof HTMLInputElement && target.type === 'checkbox') {
        if (formRef.current) syncCheckboxGroup(target, formRef.current);
    }

    const field = target as FormField;
    if (!field.name) return;

    field.classList.add('is-touched');
    const formValues = getValue() as FV;

    // Limpa timer anterior se houver (Debounce)
    if (debounceMap.current.has(field.name)) {
        clearTimeout(debounceMap.current.get(field.name));
        debounceMap.current.delete(field.name);
    }

    // ESTRATÉGIA UX: "Reward Early, Punish Late"

    // 1. BLUR (Saída): Valida imediatamente.
    // Se inválido, a borda fica vermelha via CSS (.is-touched:invalid).
    // Não mostramos balão aqui para não roubar foco.
    if (event.type === 'blur') {
        validateFieldInternal(field, formValues);
        return;
    }

    // 2. INPUT/CHANGE (Digitação): Validação Inteligente.
    if (event.type === 'input' || event.type === 'change') {
        const wasInvalid = field.hasAttribute('aria-invalid') || !field.validity.valid;

        // Se estava válido, não incomoda o usuário enquanto digita.
        if (!wasInvalid) return;

        // Se estava inválido, verifica se corrigiu.
        const msg = validateFieldInternal(field, formValues);

        if (!msg) {
            // REWARD: Se consertou, limpa o erro IMEDIATAMENTE (Borda volta ao normal).
            // Não precisa fazer nada extra, o validateFieldInternal já limpou.
        } else {
            // PUNISH LATE: Se continua errado, espera o usuário parar de digitar (600ms).
            // Se parar e continuar errado, aí sim mostramos o balão de ajuda.
            const timer = setTimeout(() => {
                // Verifica foco antes de mostrar balão (só mostra se ainda estiver focado)
                if (document.activeElement === field) {
                    field.reportValidity();
                }
            }, 600); 

            debounceMap.current.set(field.name, timer);
        }
    }
  }, [getValue]);

  // ============ RESET / LOAD DATA ============
  
  /**
   * Preenche o formulário com dados (ex: vindos de uma API) ou reseta.
   * Usa a técnica de Native Bypass para garantir que a UI do React reaja.
   */
  const resetSection = React.useCallback((namePrefix: string, originalValues: any) => {
      const form = formRef.current;
      if (!form) return;

      const fields = getFormFields(form, namePrefix);
      
      fields.forEach(field => {
          // Limpa validações pendentes
          if (debounceMap.current.has(field.name)) {
              clearTimeout(debounceMap.current.get(field.name));
              debounceMap.current.delete(field.name);
          }
          field.setCustomValidity('');

          const relativePath = getRelativePath(field.name, namePrefix);
          let valueToApply = undefined;
          
          if (originalValues) {
             valueToApply = relativePath ? getNestedValue(originalValues, relativePath) : undefined;
             if (valueToApply === undefined && !relativePath) {
                 valueToApply = getNestedValue(originalValues, field.name);
             }
          }

          // Aplicação de Valor com Bypass
          if (field instanceof HTMLInputElement && (field.type === 'checkbox' || field.type === 'radio')) {
              let shouldCheck = false;
              if (valueToApply !== undefined) {
                  if (field.type === 'checkbox' && Array.isArray(valueToApply)) {
                      shouldCheck = valueToApply.includes(field.value);
                  } else if (field.type === 'checkbox' && typeof valueToApply === 'boolean') {
                      shouldCheck = valueToApply;
                  } else {
                      shouldCheck = field.value === String(valueToApply);
                  }
              } else {
                  shouldCheck = field.defaultChecked;
              }
              setNativeChecked(field, shouldCheck);
          } else {
              const newVal = String(valueToApply ?? (field as any).defaultValue ?? '');
              setNativeValue(field, newVal);
          }
          
          field.classList.remove('is-touched');
      });
      
      // Recalcula visual dos grupos de checkbox
      setTimeout(() => initializeCheckboxMasters(form), 0);
  }, []);

  // ============ INFRAESTRUTURA (LISTENERS) ============

  const addFieldInteractionListeners = (field: HTMLElement): void => {
    const isMaster = field.hasAttribute('data-checkbox-master');
    const allowedTypes = [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement];
    if (!allowedTypes.some(type => field instanceof type)) return;
    
    if (((field as any).name || isMaster) && !fieldListeners.current.has(field)) {
        const listeners = { blur: handleFieldInteraction, change: handleFieldInteraction };
        field.addEventListener('blur', listeners.blur);
        
        // Ouve INPUT para texto (melhor para debounce) e CHANGE para outros
        const inputEvent = (field instanceof HTMLInputElement && (field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'search')) ? 'input' : 'change';
        
        if (inputEvent === 'input') field.addEventListener('input', listeners.change);
        field.addEventListener('change', listeners.change);
        
        fieldListeners.current.set(field, listeners);
    }
  };

  const removeFieldInteractionListeners = (field: HTMLElement): void => {
    const listeners = fieldListeners.current.get(field);
    if (listeners) {
        field.removeEventListener('blur', listeners.blur);
        field.removeEventListener('input', listeners.change);
        field.removeEventListener('change', listeners.change);
        fieldListeners.current.delete(field);
    }
  };

  const setupDOMMutationObserver = (form: HTMLFormElement): () => void => {
    // 1. Inicializa listeners
    const initialFields = getFormFields(form);
    initialFields.forEach(addFieldInteractionListeners);
    
    form.querySelectorAll('input[type="checkbox"][data-checkbox-master]').forEach(cb => {
        if (cb instanceof HTMLElement) addFieldInteractionListeners(cb);
    });
    initializeCheckboxMasters(form);

    // 2. Observer
    const observer = new MutationObserver((mutations) => {
      let needsReinitMasters = false;
      mutations.forEach((mutation) => {
        if (mutation.type !== 'childList') return;

        mutation.addedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) return;
          addFieldInteractionListeners(node);
          getFormFields(node as any).forEach(addFieldInteractionListeners);
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
      if (needsReinitMasters) initializeCheckboxMasters(form);
    });

    observer.observe(form, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      fieldListeners.current.forEach((l, f) => { 
          f.removeEventListener('blur', l.blur); 
          f.removeEventListener('input', l.change); 
          f.removeEventListener('change', l.change);
      });
      fieldListeners.current.clear();
    };
  };

  // ============ SUBMIT ============
  const handleSubmit = React.useCallback((onValid: (data: FV) => void) => 
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = formRef.current;
      if (!form) return;

      const allFields = getFormFields(form);
      allFields.forEach(field => {
          field.classList.add('is-touched');
          if (debounceMap.current.has(field.name)) {
              clearTimeout(debounceMap.current.get(field.name));
              debounceMap.current.delete(field.name);
          }
      });

      revalidateAllCustomRules();

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

  const focusFirstInvalidField = (form: HTMLFormElement): void => {
    const activeSection = form.querySelector('fieldset:not(:disabled)') || form;
    const firstInvalid = activeSection.querySelector<HTMLElement>(':invalid');
    if (!firstInvalid) return;

    const focusableSibling = firstInvalid.parentElement?.querySelector<HTMLElement>(
        'input:not([type="hidden"]), select, textarea, [tabindex="0"]'
    );
    if (focusableSibling) focusableSibling.focus();
    else firstInvalid.focus();
  };

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