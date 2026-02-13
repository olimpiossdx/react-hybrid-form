import React, { useCallback, useRef } from 'react';

import type { FieldListenerMap, FormField, Path, PathValue, UseFormConfig, ValidationMode, ValidatorMap } from './props';
import { getFormFields, getNestedValue, getRelativePath, parseFieldValue, setNestedValue } from './utilities';
import { initializeCheckboxMasters, setNativeChecked, setNativeValue, syncCheckboxGroup } from '../../utils/utilities';
import type { ValidationResult, ValidationSeverity } from '../../utils/validate';

/**
 * Hook principal para gerenciamento de formulários com arquitetura Híbrida.
 * * Funcionalidades:
 * - **Uncontrolled:** O DOM é a fonte da verdade.
 * - **Native Bypass:** Sincronia de edição programática.
 * - **Scoped Validation:** Validação parcial para Wizards/Tabs.
 * - **Callback Ref:** Gerenciamento robusto de ciclo de vida do DOM.
 */
const useForm = <FV extends Record<string, any>>(configOrId?: string | UseFormConfig<FV>) => {
  // Normalização da Configuração
  const config = typeof configOrId === 'string' ? ({ id: configOrId } as UseFormConfig<FV>) : configOrId || {};
  const formId = config.id || crypto.randomUUID();
  const onSubmitCallback = config.onSubmit;
  const validationMode: ValidationMode = config.validationMode ?? 'native';

  // --- REFS DE ESTADO (Persistem entre renders) ---
  const fieldListeners = useRef<FieldListenerMap>(new Map());
  const validators = useRef<ValidatorMap<FV>>({});
  const debounceMap = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const isResetting = useRef(false);
  const observerRef = useRef<MutationObserver | null>(null);

  // Referência ativa do elemento <form> no DOM
  const formRef = useRef<HTMLFormElement | null>(null);

  // --- GERENCIAMENTO DE LISTENERS ---

  const cleanupLogic = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    fieldListeners.current.forEach((listeners, field) => {
      field.removeEventListener('blur', listeners.blur);
      field.removeEventListener('input', listeners.change);
      field.removeEventListener('change', listeners.change);
    });
    fieldListeners.current.clear();
  };

  /**
   * **Callback Ref**: A chave da arquitetura.
   * O React chama esta função sempre que o nó DOM do form é montado ou desmontado.
   * Isso garante que os listeners sejam reconectados mesmo se o form for recriado (key change).
   */
  const registerForm = useCallback((node: HTMLFormElement | null) => {
    if (formRef.current) {
      cleanupLogic(); // Limpa o anterior
    }

    formRef.current = node;

    if (node) {
      setupDOMMutationObserver(node); // Inicia no novo
    }
  }, []);

  const countFieldsByName = (form: HTMLElement, name: string): number => {
    return form.querySelectorAll(`[name="${name}"]`).length;
  };

  const setValidators = useCallback((newValidators: ValidatorMap<FV>) => {
    validators.current = newValidators;
  }, []);

  // ============ LEITURA DE DADOS (DOM -> JSON) ============

  const getValueImpl = useCallback((namePrefix?: string): any => {
    const form = formRef.current;
    if (!form) {
      return namePrefix ? undefined : ({} as FV);
    }

    const fields = getFormFields(form, namePrefix);

    // Busca exata (campo único)
    if (namePrefix) {
      const exactMatch = fields.find((f) => f.name === namePrefix);
      if (exactMatch) {
        if (exactMatch instanceof HTMLInputElement && exactMatch.type === 'checkbox') {
          // Se for checkbox único, retorna boolean. Se for grupo, retorna array.
          if (countFieldsByName(form, exactMatch.name) === 1) {
            const hasValue = exactMatch.hasAttribute('value') && exactMatch.value !== 'on';
            return exactMatch.checked ? (hasValue ? exactMatch.value : true) : false;
          }
        }
        return parseFieldValue(exactMatch);
      }
    }

    // Busca coletiva (Objeto completo)
    const formData = {};
    const processedNames = new Set<string>();

    fields.forEach((field) => {
      const relativePath = getRelativePath(field.name, namePrefix);
      if (!relativePath || processedNames.has(field.name)) {
        return;
      }

      if (field instanceof HTMLInputElement && field.type === 'checkbox') {
        const count = countFieldsByName(form, field.name);
        if (count > 1) {
          // Grupo de Checkbox: Retorna Array de valores marcados
          const allChecked = form.querySelectorAll<HTMLInputElement>(`input[type="checkbox"][name="${field.name}"]:checked`);
          const values = Array.from(allChecked).map((cb) => cb.value);
          setNestedValue(formData, relativePath, values);
          processedNames.add(field.name);
        } else {
          // Checkbox Único
          if (field.checked) {
            const hasExplicitValue = field.hasAttribute('value') && field.value !== 'on';
            setNestedValue(formData, relativePath, hasExplicitValue ? field.value : true);
          } else {
            setNestedValue(formData, relativePath, false);
          }
        }
        return;
      }
      // Outros Inputs (Text, Radio, Select, FileHíbrido)
      setNestedValue(formData, relativePath, parseFieldValue(field));
    });

    return formData;
  }, []);

  // Tipagem forte para o getValue
  const getValue = getValueImpl as { (): FV; <P extends Path<FV>>(namePrefix: P): PathValue<FV, P>; (namePrefix: string): any };

  // ============ VALIDAÇÃO ============

  /**
   * Resultado interno de validação.
   * type pode ter um marcador interno '__none__' para "sem erro".
   * Esse marcador é usado apenas dentro do hook. Para fora, usamos apenas ValidationSeverity.
   */
  type InternalValidationType = ValidationSeverity | '__none__';

  interface InternalValidationResult {
    message: string;
    type: InternalValidationType;
  }
  /**
   * Normaliza o ValidationResult (string | IValidationResult | undefined)
   * em um InternalValidationResult com message + type.
   * - string → { message, type: 'error' }
   * - IValidationResult → mantém message + type
   * - undefined → { message: '', type: '__none__' }
   */
  const normalizeValidationResult = (result: ValidationResult): InternalValidationResult => {
    if (!result) {
      return { message: '', type: '__none__' };
    }

    if (typeof result === 'string') {
      return { message: result, type: 'error' };
    }

    return {
      message: result.message,
      type: result.type!,
    };
  };

  /**
   * Executa a validação de um campo:
   * - Limpa estado anterior
   * - Validação nativa (HTML5)
   * - Validação custom (ValidateFn)
   * Sem erro:
   *   { message: '', type: '__none__' }
   * Com erro:
   *   { message: '...', type: 'error' | 'warning' | 'info' | 'success' }
   */
  const validateFieldInternal = (field: FormField, formValues: FV): InternalValidationResult => {
    const validateFn = validators.current[field.dataset.validation || ''];

    // 1. Limpeza de erro anterior
    field.setCustomValidity('');

    // 2. Validação Nativa (HTML5)
    // Se falhar aqui, paramos e usamos a mensagem do browser
    if (!field.checkValidity()) {
      const nativeMessage = field.validationMessage || '';

      return {
        message: nativeMessage,
        type: 'error', // nativo é sempre erro
      };
    }

    // 3. Validação Customizada (JS)
    if (validateFn) {
      const fieldValue = getNestedValue(formValues, field.name);
      const rawResult = validateFn(fieldValue, field, formValues); // ValidationResult

      const normalized = normalizeValidationResult(rawResult);

      if (normalized.message) {
        // Injeta o erro no browser (constraint API)
        field.setCustomValidity(normalized.message);
        return normalized;
      }
    }

    // Sem erro: mantém semântica antiga (string vazia = ok)
    return { message: '', type: '__none__' };
  };

  /**
   * Atualiza a UI de erro nativa (slot/balão etc.) respeitando o validationMode.
   * - message: string vazia = sem erro (mesma semântica antiga)
   * - mode = 'helper' → NÃO mostra texto no slot nativo, apenas aria/flags.
   * - mode = 'native' | 'both' → mostra texto normalmente.
   */
  const updateErrorUI = (field: FormField, result: InternalValidationResult, mode: ValidationMode) => {
    const message = result.message;
    const hasError = !!message;

    const errorId = `error-${field.name}`;
    const errorSlot = document.getElementById(errorId);

    // Aria e flags comuns
    if (hasError) {
      field.setAttribute('aria-invalid', 'true');
      if (errorSlot) {
        field.setAttribute('aria-describedby', errorId);
      }
    } else {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    }

    if (!errorSlot) {
      return;
    }

    if (mode === 'helper') {
      // Não mostra texto no slot/balão nativo
      errorSlot.textContent = '';
      errorSlot.setAttribute('data-visible', 'false');
      errorSlot.style.display = 'none';
      return;
    }

    // mode 'native' ou 'both' → mantém comportamento atual de texto nativo
    errorSlot.textContent = message;
    errorSlot.setAttribute('data-visible', hasError ? 'true' : 'false');
    errorSlot.style.display = hasError ? 'block' : 'none';

    // FUTURO: aqui você pode variar aparência conforme result.type
    // ex.: errorSlot.dataset.severity = result.type;
  };

  // ============ VALIDAÇÃO GLOBAL (revalidateAllCustomRules) ============
  const revalidateAllCustomRules = useCallback(() => {
    const form = formRef.current;
    if (!form) {
      return;
    }

    const formValues = getValue() as FV;
    const allFields = getFormFields(form);

    allFields.forEach((field) => {
      if (field.disabled) {
        return;
      }

      const result = validateFieldInternal(field, formValues);
      updateErrorUI(field, result, validationMode ?? 'native');
      // quando o helper estiver integrado ao hook:
      // syncHelperForField(field, result, config.validationMode ?? 'native');
    });
  }, [getValue]); // validationMode está em config, não precisa no deps se ler direto de config

  /**
   * Valida apenas um subconjunto de campos dentro de um container específico.
   * Essencial para Wizards e Abas onde apenas o passo atual deve ser validado.
   */
  const validateScope = useCallback(
    (container: HTMLElement) => {
      const form = formRef.current;
      if (!form || !container) {
        return true;
      }

      const formValues = getValue() as FV;
      const fieldsInScope = getFormFields(container);

      let isValid = true;
      let firstInvalid: HTMLElement | null = null;

      fieldsInScope.forEach((field) => {
        field.classList.add('is-touched');
        if (field.disabled) {
          return;
        }

        const result = validateFieldInternal(field, formValues);
        updateErrorUI(field, result, validationMode ?? 'native');
        // syncHelperForField(field, result, config.validationMode ?? 'native');

        if (result.message || !field.checkValidity()) {
          isValid = false;
          if (!firstInvalid) {
            firstInvalid = field;
          }
        }
      });

      if (!isValid && firstInvalid) {
        // @ts-ignore
        if (firstInvalid.reportValidity) {
          (firstInvalid as FormField).reportValidity();
        }
        // @ts-ignore
        firstInvalid.focus();
      }

      return isValid;
    },
    [getValue],
  );

  // ============ INTERAÇÃO (LISTENERS) ============

  const handleFieldInteraction = useCallback(
    (event: Event) => {
      if (isResetting.current) {
        return;
      }

      const target = event.currentTarget;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      // Sincronia de Checkbox Group
      if (event.type === 'change' && target instanceof HTMLInputElement && target.type === 'checkbox') {
        if (formRef.current) {
          syncCheckboxGroup(target, formRef.current);
        }
      }

      const field = target as FormField;
      if (!field.name) {
        return;
      }

      field.classList.add('is-touched');
      const formValues = getValue() as FV;

      if (debounceMap.current.has(field.name)) {
        clearTimeout(debounceMap.current.get(field.name));
        debounceMap.current.delete(field.name);
      }

      // Blur: Valida imediatamente
      if (event.type === 'blur') {
        const result = validateFieldInternal(field, formValues);
        updateErrorUI(field, result, validationMode ?? 'native');
        // syncHelperForField(field, result, config.validationMode ?? 'native');
        return;
      }

      // Input/Change: Valida com Debounce (600ms)
      if (event.type === 'input' || event.type === 'change') {
        const wasInvalid = field.hasAttribute('aria-invalid') || !field.validity.valid;
        if (!wasInvalid) {
          return;
        }

        const result = validateFieldInternal(field, formValues);
        const msg = result.message;

        if (!msg) {
          // Limpa erro na hora se corrigiu
          updateErrorUI(field, { message: '', type: '__none__' }, validationMode ?? 'native');
          // syncHelperForField(field, { message: '', type: '__none__' }, config.validationMode ?? 'native');
        } else {
          const timer = setTimeout(() => {
            updateErrorUI(field, result, validationMode ?? 'native');
            // syncHelperForField(field, result, config.validationMode ?? 'native');

            if (document.activeElement === field) {
              // @ts-ignore
              if (field.reportValidity) {
                // @ts-ignore
                field.reportValidity();
              }
            }
          }, 600);
          debounceMap.current.set(field.name, timer);
        }
      }
    },
    [getValue],
  );

  // ============ RESET / LOAD DATA ============

  const resetSection = useCallback((namePrefix: string, originalValues: any) => {
    const form = formRef.current;
    if (!form) {
      return;
    }

    isResetting.current = true; // Bloqueia listeners durante o reset
    try {
      const fields = getFormFields(form, namePrefix);

      fields.forEach((field) => {
        // Limpa timers pendentes
        if (debounceMap.current.has(field.name)) {
          clearTimeout(debounceMap.current.get(field.name));
          debounceMap.current.delete(field.name);
        }
        updateErrorUI(field, { message: '', type: '__none__' }, validationMode ?? 'native');

        // Descobre o valor no objeto de dados
        const relativePath = getRelativePath(field.name, namePrefix);
        let valueToApply = undefined;
        if (originalValues) {
          valueToApply = relativePath ? getNestedValue(originalValues, relativePath) : undefined;
          if (valueToApply === undefined && !relativePath) {
            valueToApply = getNestedValue(originalValues, field.name);
          }
        }

        // Aplica valor usando setters nativos (Bypass)
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
        field.setCustomValidity('');
      });

      setTimeout(() => initializeCheckboxMasters(form), 0);
    } finally {
      setTimeout(() => {
        isResetting.current = false;
      }, 0);
    }
  }, []);

  // ============ OBSERVER & SETUP ============

  const addFieldInteractionListeners = (field: HTMLElement): void => {
    const isMaster = field.hasAttribute('data-checkbox-master');
    const allowedTypes = [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement];
    if (!allowedTypes.some((type) => field instanceof type)) {
      return;
    }

    if (((field as any).name || isMaster) && !fieldListeners.current.has(field)) {
      const listeners = {
        blur: handleFieldInteraction,
        change: handleFieldInteraction,
      };
      field.addEventListener('blur', listeners.blur);

      // Input para texto, Change para outros
      const inputEvent =
        field instanceof HTMLInputElement &&
        (field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'search')
          ? 'input'
          : 'change';

      if (inputEvent === 'input') {
        field.addEventListener('input', listeners.change);
      }
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

  const setupDOMMutationObserver = (form: HTMLFormElement): void => {
    const initialFields = getFormFields(form);
    initialFields.forEach(addFieldInteractionListeners);

    // Inicializa mestres
    form.querySelectorAll('input[type="checkbox"][data-checkbox-master]').forEach((cb) => {
      if (cb instanceof HTMLElement) {
        addFieldInteractionListeners(cb);
      }
    });
    initializeCheckboxMasters(form);

    observerRef.current = new MutationObserver((mutations) => {
      let needsReinitMasters = false;
      mutations.forEach((mutation) => {
        if (mutation.type !== 'childList') {
          return;
        }
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) {
            return;
          }
          addFieldInteractionListeners(node);
          getFormFields(node as any).forEach(addFieldInteractionListeners);
          if (node.querySelector('input[type="checkbox"]') || (node instanceof HTMLInputElement && node.type === 'checkbox')) {
            needsReinitMasters = true;
          }
        });
        mutation.removedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) {
            return;
          }
          removeFieldInteractionListeners(node);
          getFormFields(node as any).forEach(removeFieldInteractionListeners);
        });
      });
      if (needsReinitMasters) {
        initializeCheckboxMasters(form);
      }
    });

    observerRef.current.observe(form, { childList: true, subtree: true });
  };

  const focusFirstInvalidField = (form: HTMLFormElement): void => {
    const invalid = form.querySelector<HTMLElement>(':invalid');
    if (!invalid || invalid === null) {
      return;
    }

    // Tenta focar elementos visuais se o input for hidden (Shadow Inputs)
    const focusable = invalid.parentElement?.querySelector<HTMLElement>('input:not([type="hidden"]), select, textarea, [tabindex="0"]');
    if (focusable && focusable instanceof HTMLElement) {
      focusable.focus();
      return;
    } else {
      invalid.focus();
    }
    //focusable !== null || focusable !== undefined ? focusable.focus() : invalid.focus();
  };

  // ============ SUBMIT ============

  const handleSubmit = useCallback(
    (onValid: (data: FV, event: React.FormEvent<HTMLFormElement>) => void) => (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = formRef.current;
      if (!form) {
        return;
      }

      const allFields = getFormFields(form);
      allFields.forEach((field) => field.classList.add('is-touched'));

      revalidateAllCustomRules();

      setTimeout(() => {
        if (!formRef.current) {
          return;
        }
        const isValid = formRef.current.checkValidity();

        if (!isValid) {
          focusFirstInvalidField(form);
          form.reportValidity();
        } else {
          // Sucesso! Passa dados e evento
          onValid(getValue() as FV, event);
        }
      }, 0);
    },
    [getValue, revalidateAllCustomRules],
  );

  // Prepara o handler se foi passado na config
  const submitHandler = onSubmitCallback ? handleSubmit(onSubmitCallback) : undefined;

  // Objeto de Props pronto para uso (DX)
  const formProps = {
    id: formId,
    ref: registerForm,
    onSubmit: submitHandler,
    noValidate: true,
  };

  return {
    handleSubmit,
    setValidators,
    formId,
    resetSection,
    getValue,
    registerForm,
    formProps,
    validateScope, // API Pública para Wizards
  };
};

export default useForm;
