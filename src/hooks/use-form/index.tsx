import React from "react";
import { syncCheckboxGroup, initializeCheckboxMasters, setNativeValue, setNativeChecked } from "../../utils/utilities";
import type { FieldListenerMap, ValidatorMap, FormField, Path, PathValue } from "./props";
import { getFormFields, parseFieldValue, getRelativePath, setNestedValue, getNestedValue } from "./utilities";

/**
 * Hook principal para gerenciamento de formulários híbridos.
 * * Utiliza uma arquitetura **Uncontrolled** (Valores no DOM) para máxima performance,
 * enquanto oferece APIs do React para validação complexa e orquestração.
 * * @template FV - Tipo genérico representando a estrutura dos dados do formulário.
 * @param providedId - (Opcional) ID do formulário HTML. Se omitido, um ID único é gerado.
 */
const useForm = <FV extends Record<string, any>>(providedId?: string) => {
  const formId = providedId || React.useId();
  const formRef = React.useRef<HTMLFormElement>(null);

  const fieldListeners = React.useRef<FieldListenerMap>(new Map());
  const validators = React.useRef<ValidatorMap<FV>>({});

  // Mapa de Timers para a estratégia "Smart Debounce" de validação
  const debounceMap = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // SEMÁFORO: Bloqueia validação durante reset programático
  const isResetting = React.useRef(false);

  /**
   * Helper: Conta ocorrências de campos com o mesmo nome.
   * Usado para distinguir Checkbox Único (Boolean) de Checkbox Group (Array).
   */
  const countFieldsByName = (form: HTMLElement, name: string): number => {
    return form.querySelectorAll(`[name="${name}"]`).length;
  };

  /**
   * Registra regras de validação customizadas.
   * A validação roda em pipeline: Nativa (HTML) -> Customizada (JS).
   */
  const setValidators = React.useCallback((newValidators: ValidatorMap<FV>) => {
    validators.current = newValidators;
  }, []);

  // ============ LEITURA (IMPLEMENTAÇÃO) ============
  // Mantemos a implementação como 'any' internamente para flexibilidade do DOM
  const getValueImpl = React.useCallback((namePrefix?: string): any => {
    const form = formRef.current;
    if (!form) return namePrefix ? undefined : ({} as FV);

    const fields = getFormFields(form, namePrefix);

    if (namePrefix) {
      const exactMatch = fields.find(f => f.name === namePrefix);
      if (exactMatch) {
        if (exactMatch instanceof HTMLInputElement && exactMatch.type === 'checkbox') {
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

      if (field instanceof HTMLInputElement && field.type === 'checkbox') {
        const count = countFieldsByName(form, field.name);
        if (count > 1) {
          const allChecked = form.querySelectorAll<HTMLInputElement>(`input[type="checkbox"][name="${field.name}"]:checked`);
          const values = Array.from(allChecked).map(cb => cb.value);
          setNestedValue(formData, relativePath, values);
          processedNames.add(field.name);
        } else {
          if (field.checked) {
            const hasExplicitValue = field.hasAttribute('value') && field.value !== 'on';
            setNestedValue(formData, relativePath, hasExplicitValue ? field.value : true);
          } else {
            setNestedValue(formData, relativePath, false);
          }
        }
        return;
      }
      setNestedValue(formData, relativePath, parseFieldValue(field));
    });

    return formData;
  }, []);

  // ============ EXPOSIÇÃO TIPADA (SOBRECARGAS) ============
  /**
   * Lê os valores do formulário.
   * O TypeScript inferirá automaticamente o tipo de retorno com base no caminho passado.
   */
  const getValue = getValueImpl as {
    /**
     * Retorna o objeto completo do formulário tipado.
     */
    (): FV;

    /**
     * Retorna o valor de um campo específico.
     * O TypeScript valida se o caminho existe e retorna o tipo exato (string, number, boolean...).
     * Suporta arrays (ex: 'items.0.name').
     */
    <P extends Path<FV>>(namePrefix: P): PathValue<FV, P>;

    /**
     * Fallback para strings dinâmicas não conhecidas em tempo de compilação.
     */
    (namePrefix: string): any;
  };

  // ============ UI UPDATE ============

  const updateErrorUI = (field: FormField, message: string) => {
    const errorId = `error-${field.name}`;
    const errorSlot = document.getElementById(errorId);

    if (message) {
      field.setAttribute('aria-invalid', 'true');
      if (errorSlot) field.setAttribute('aria-describedby', errorId);
    } else {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    }

    if (errorSlot) {
      errorSlot.textContent = message;
      errorSlot.setAttribute('data-visible', message ? 'true' : 'false');
      errorSlot.style.display = message ? 'block' : 'none';
    }
  };

  // ============ HELPER DE VALIDAÇÃO (NATIVE FIRST) ============

  /**
   * Executa a pipeline de validação para um campo.
   * Ordem: 1. Limpeza -> 2. Nativa (HTML5) -> 3. Customizada (JS).
   */
  const validateFieldInternal = (field: FormField, formValues: FV): string => {
    const validateFn = validators.current[field.dataset.validation || ''];

    // PASSO 1: LIMPEZA (Reset)
    // Removemos qualquer erro customizado anterior (setCustomValidity(''))
    // Isso faz o campo voltar a ser "Válido" aos olhos do navegador, 
    // permitindo que o checkValidity() abaixo teste apenas as regras HTML puras.
    field.setCustomValidity('');

    // PASSO 2: VALIDAÇÃO NATIVA (HTML5 Constraint Validation)
    // Verifica: required, type=email, min, max, pattern, step.
    // MDN: Se o campo for opcional e estiver vazio, checkValidity() retorna true.
    if (!field.checkValidity()) {
      // Se o HTML falhar, paramos aqui. O erro estrutural tem prioridade.
      // Retornamos a mensagem traduzida do próprio navegador.
      return field.validationMessage;
    }

    // PASSO 3: VALIDAÇÃO CUSTOMIZADA (Regra de Negócio)
    // Só chegamos aqui se o dado está estruturalmente correto (ou vazio opcional).
    if (validateFn) {
      const fieldValue = getNestedValue(formValues, field.name);

      // Executa a regra do desenvolvedor
      const result = validateFn(fieldValue, field, formValues);

      if (result) {
        const message = typeof result === 'string' ? result : result.message;

        // Injeta o erro de negócio. 
        // Isso faz o campo ficar :invalid novamente e prepara o balão.
        field.setCustomValidity(message);
        return message;
      }
    }

    return ''; // Sucesso Total
  };

  // ============ VALIDAÇÃO EM MASSA ============

  const revalidateAllCustomRules = React.useCallback(() => {
    const form = formRef.current;
    if (!form) return;
    const formValues = getValue() as FV;

    const allFields = getFormFields(form);
    allFields.forEach(field => {
      if (field.disabled) return;
      const msg = validateFieldInternal(field, formValues);
      updateErrorUI(field, msg);
    });
  }, [getValue]);

  // ============ INTERAÇÃO & SMART DEBOUNCE ============

  const handleFieldInteraction = React.useCallback((event: Event) => {
    // Se estamos num reset programático, ignoramos eventos
    if (isResetting.current) return;

    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) return;

    // Checkbox Sync (Imediato)
    if (event.type === 'change' && target instanceof HTMLInputElement && target.type === 'checkbox') {
      if (formRef.current) syncCheckboxGroup(target, formRef.current);
    }

    const field = target as FormField;
    if (!field.name) return;

    field.classList.add('is-touched');
    const formValues = getValue() as FV;

    if (debounceMap.current.has(field.name)) {
      clearTimeout(debounceMap.current.get(field.name));
      debounceMap.current.delete(field.name);
    }

    // Blur: Valida imediatamente (Punish Late)
    if (event.type === 'blur') {
      const msg = validateFieldInternal(field, formValues);
      updateErrorUI(field, msg);
      return;
    }

    // Input/Change: Validação com Debounce (Reward Early)
    if (event.type === 'input' || event.type === 'change') {
      const wasInvalid = field.hasAttribute('aria-invalid') || !field.validity.valid;
      if (!wasInvalid) return;

      const msg = validateFieldInternal(field, formValues);

      if (!msg) {
        updateErrorUI(field, ''); // Limpa erro imediatamente ao corrigir
      } else {
        const timer = setTimeout(() => {
          updateErrorUI(field, msg);
          // Só mostra balão se o usuário ainda estiver focado (ajuda contextual)
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
   * Preenche ou limpa campos do formulário programaticamente.
   */
  const resetSection = React.useCallback((namePrefix: string, originalValues: any) => {
    const form = formRef.current;
    if (!form) return;

    isResetting.current = true;

    try {
      const fields = getFormFields(form, namePrefix);

      fields.forEach(field => {
        if (debounceMap.current.has(field.name)) {
          clearTimeout(debounceMap.current.get(field.name));
          debounceMap.current.delete(field.name);
        }
        updateErrorUI(field, '');

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
        field.setCustomValidity('');
      });

      setTimeout(() => initializeCheckboxMasters(form), 0);

    } finally {
      setTimeout(() => { isResetting.current = false; }, 0);
    }
  }, []);

  // ============ INFRAESTRUTURA ============

  const addFieldInteractionListeners = (field: HTMLElement): void => {
    const isMaster = field.hasAttribute('data-checkbox-master');
    const allowedTypes = [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement];
    if (!allowedTypes.some(type => field instanceof type)) return;

    if (((field as any).name || isMaster) && !fieldListeners.current.has(field)) {
      const listeners = { blur: handleFieldInteraction, change: handleFieldInteraction };
      field.addEventListener('blur', listeners.blur);

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
    const initialFields = getFormFields(form);
    initialFields.forEach(addFieldInteractionListeners);

    form.querySelectorAll('input[type="checkbox"][data-checkbox-master]').forEach(cb => {
      if (cb instanceof HTMLElement) addFieldInteractionListeners(cb);
    });
    initializeCheckboxMasters(form);

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
      allFields.forEach(field => field.classList.add('is-touched'));

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
    const invalid = form.querySelector<HTMLElement>(':invalid');
    if (!invalid) return;
    const focusable = invalid.parentElement?.querySelector<HTMLElement>('input:not([type="hidden"]), select, textarea, [tabindex="0"]');
    focusable ? focusable.focus() : invalid.focus();
  };

  React.useLayoutEffect(() => {
    const form = document.getElementById(formId) as HTMLFormElement;
    if (!form) return;
    formRef.current = form;
    const cleanup = setupDOMMutationObserver(form);
    return cleanup;
  }, [formId]);

  return { handleSubmit, setValidators, formId, resetSection, getValue };
};

export default useForm;