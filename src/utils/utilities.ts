/* eslint-disable no-useless-escape */
import type { FormField, IAnyObject } from '../hooks/use-form/props';

const splitPath = (path: string) => path.replace(/\]/g, '').split(/[.\[]/);

export const setNestedValue = (obj: IAnyObject, path: string, value: any): void => {
  if (value === undefined) {
    return;
  }
  const keys = splitPath(path);
  let current = obj;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const isLastKey = i === keys.length - 1;
    if (isLastKey) {
      current[key] = value;
      return;
    }
    const nextKey = keys[i + 1];
    if (!current[key]) {
      current[key] = !isNaN(Number(nextKey)) ? [] : {};
    }
    current = current[key];
  }
};

export const getNestedValue = (obj: IAnyObject, path: string): any => {
  if (!path || !obj) {
    return undefined;
  }
  const keys = splitPath(path);
  return keys.reduce((current, key) => (current && current[key] !== undefined ? current[key] : undefined), obj);
};

export const getFormFields = (root: HTMLElement, namePrefix?: string): FormField[] => {
  const selector = namePrefix
    ? `input[name^="${namePrefix}"], select[name^="${namePrefix}"], textarea[name^="${namePrefix}"]`
    : 'input[name], select[name], textarea[name]';
  const nodeList = root.querySelectorAll(selector);
  return Array.from(nodeList).filter((el): el is FormField => {
    return (
      (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) &&
      el.type !== 'submit' &&
      el.type !== 'button' &&
      el.type !== 'reset' &&
      el.type !== 'image'
    );
  });
};

export const getRelativePath = (fieldName: string, namePrefix?: string): string | null => {
  if (!namePrefix) {
    return fieldName;
  }
  if (fieldName === namePrefix) {
    return null;
  }
  if (fieldName.startsWith(namePrefix)) {
    let relative = fieldName.slice(namePrefix.length);
    if (relative.startsWith('.')) {
      relative = relative.slice(1);
    }
    return relative;
  }
  return null;
};

// --- PARSER INTELIGENTE ---
export const parseFieldValue = (field: FormField): any => {
  if (field instanceof HTMLInputElement) {
    if (field.type === 'number') {
      return field.value === '' ? '' : parseFloat(field.value);
    }
    if (field.type === 'checkbox') {
      return field.checked;
    }
    if (field.type === 'radio') {
      return field.checked ? field.value : undefined;
    }

    // ARQUIVOS
    if (field.type === 'file') {
      const newFiles = field.files ? Array.from(field.files) : [];

      if (field.dataset.keep) {
        let existingFiles: any[] = [];
        try {
          existingFiles = JSON.parse(field.dataset.keep);
        } catch {
          /* empty */
        }

        return {
          new: newFiles,
          keep: existingFiles,
          totalCount: newFiles.length + existingFiles.length,
          isHybrid: true,
        };
      }

      return newFiles;
    }
  }

  if (field instanceof HTMLSelectElement && field.multiple) {
    return Array.from(field.selectedOptions).map((opt) => opt.value);
  }

  return field.value;
};

// --- REACT BYPASS ---
export const setNativeValue = (element: HTMLElement, value: any) => {
  if ((element as any).disabled || (element as any).readOnly) {
    return;
  }

  if (element instanceof HTMLInputElement && element.type === 'file') {
    if (Array.isArray(value)) {
      element.dataset.initial = JSON.stringify(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    } else if (!value) {
      element.value = '';
      delete element.dataset.initial;
      delete element.dataset.keep;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }
  }

  let finalValue = value;
  if (typeof value === 'object' && value !== null && 'value' in value && 'label' in value) {
    finalValue = value.value;
    element.dataset.label = value.label;
  } else {
    if (value !== undefined) {
      delete element.dataset.label;
    }
  }

  finalValue = String(finalValue ?? '');
  let descriptor: PropertyDescriptor | undefined;
  if (element instanceof HTMLInputElement) {
    descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
  } else if (element instanceof HTMLSelectElement) {
    descriptor = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value');
  } else if (element instanceof HTMLTextAreaElement) {
    descriptor = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value');
  }

  if (descriptor && descriptor.set) {
    descriptor.set.call(element, finalValue);
  } else {
    (element as any).value = finalValue;
  }

  element.dispatchEvent(new Event('input', { bubbles: true }));
  if (element instanceof HTMLSelectElement) {
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }
};

export const setNativeChecked = (element: HTMLInputElement, checked: boolean) => {
  if (element.disabled || element.readOnly) {
    return;
  }
  const descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'checked');
  if (descriptor && descriptor.set) {
    descriptor.set.call(element, checked);
  } else {
    element.checked = checked;
  }
  element.dispatchEvent(new Event('change', { bubbles: true }));
};

const updateMasterState = (master: HTMLInputElement, form: HTMLElement) => {
  const groupName = master.dataset.checkboxMaster;
  if (!groupName) {
    return;
  }
  const children = Array.from(form.querySelectorAll<HTMLInputElement>(`input[type="checkbox"][name="${groupName}"]`));
  if (children.length === 0) {
    return;
  }
  const checkedCount = children.filter((c) => c.checked).length;
  master.indeterminate = false;
  if (checkedCount === 0) {
    master.checked = false;
  } else if (checkedCount === children.length) {
    master.checked = true;
  } else {
    master.checked = false;
    master.indeterminate = true;
  }
};

export const initializeCheckboxMasters = (root: HTMLElement) => {
  const masters = root.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-checkbox-master]');
  masters.forEach((master) => updateMasterState(master, master.form || (root as HTMLElement)));
};

export const syncCheckboxGroup = (target: HTMLInputElement, form: HTMLElement) => {
  if (target.dataset.checkboxMaster) {
    const groupName = target.dataset.checkboxMaster;
    const children = Array.from(form.querySelectorAll<HTMLInputElement>(`input[type="checkbox"][name="${groupName}"]`));
    const enabledChildren = children.filter((child) => !child.disabled && !child.readOnly);
    const allEnabledChecked = enabledChildren.length > 0 && enabledChildren.every((child) => child.checked);
    const shouldCheckAll = !allEnabledChecked;
    enabledChildren.forEach((child) => {
      if (child.checked !== shouldCheckAll) {
        setNativeChecked(child, shouldCheckAll);
      }
    });
    updateMasterState(target, form);
    return;
  }
  if (target.name) {
    const master = form.querySelector<HTMLInputElement>(`input[type="checkbox"][data-checkbox-master="${target.name}"]`);
    if (master) {
      updateMasterState(master, form);
    }
  }
};

export const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};
