import type { IAnyObject, FormField } from "../hooks/use-form/props";

const splitPath = (path: string) => path.replace(/\]/g, '').split(/[.\[]/);

/**
 * Define um valor em um objeto/array usando um caminho de string (dot notation).
 * Cria automaticamente objetos ou arrays aninhados conforme necessário.
 * * @example
 * const obj = {};
 * setNestedValue(obj, 'users[0].name', 'Alice');
 * // obj torna-se { users: [{ name: 'Alice' }] }
 */
export const setNestedValue = (obj: IAnyObject, path: string, value: any): void => {
  if (value === undefined) return;
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
    const nextIsNumber = !isNaN(Number(nextKey));
    if (!current[key]) {
      current[key] = nextIsNumber ? [] : {};
    }
    current = current[key];
  }
};

/**
 * Obtém um valor de um objeto aninhado usando um caminho de string.
 * Retorna undefined se o caminho não existir.
 * * @example
 * getNestedValue({ a: { b: 1 } }, 'a.b') // retorna 1
 */
export const getNestedValue = (obj: IAnyObject, path: string): any => {
  if (!path || !obj) return undefined;
  const keys = splitPath(path);
  return keys.reduce((current, key) => {
    return (current && current[key] !== undefined) ? current[key] : undefined;
  }, obj);
};

/**
 * Busca todos os campos de formulário válidos (Input, Select, Textarea) dentro de um elemento raiz.
 * Filtra botões, resets e inputs de imagem.
 * * @param root O elemento container (form, fieldset, div, etc.)
 * @param namePrefix (Opcional) Filtra campos que começam com este prefixo no atributo 'name'.
 */
export const getFormFields = (root: HTMLElement, namePrefix?: string): FormField[] => {
  const selector = namePrefix
    ? `input[name^="${namePrefix}"], select[name^="${namePrefix}"], textarea[name^="${namePrefix}"]`
    : "input[name], select[name], textarea[name]";
  
  const nodeList = root.querySelectorAll(selector);
  return Array.from(nodeList).filter((el): el is FormField => {
    return (
      (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) &&
      el.type !== 'submit' && el.type !== 'button' && el.type !== 'reset' && el.type !== 'image'
    );
  });
};

/**
 * Calcula o caminho relativo de um campo, removendo o prefixo do nome.
 * Útil para mapear campos aninhados (ex: 'address.city') para o objeto de dados local ({ city: ... }).
 */
export const getRelativePath = (fieldName: string, namePrefix?: string): string | null => {
  if (!namePrefix) return fieldName;
  if (fieldName === namePrefix) return null;
  if (fieldName.startsWith(namePrefix)) {
    let relative = fieldName.slice(namePrefix.length);
    if (relative.startsWith('.')) relative = relative.slice(1);
    return relative;
  }
  return null;
};

/**
 * Converte o valor bruto do DOM para um tipo primitivo JavaScript apropriado.
 * - 'number' -> number
 * - 'checkbox' -> boolean
 * - 'radio' -> valor se checked, undefined se não
 */
export const parseFieldValue = (field: FormField): any => {
  if (field instanceof HTMLInputElement) {
    if (field.type === 'number') return field.value === '' ? '' : parseFloat(field.value);
    if (field.type === 'checkbox') return field.checked;
    if (field.type === 'radio') return field.checked ? field.value : undefined;
  }
  return field.value;
};

// ============ REATIVIDADE FORÇADA (REACT BYPASS) ============

/**
 * Força a definição do valor de um input (Text, Select, Textarea) ignorando o wrapper de eventos do React.
 * Usa o protótipo nativo para garantir que a mudança seja detectada como uma interação real.
 * Dispara eventos 'input' e 'change' para notificar listeners.
 */
export const setNativeValue = (element: HTMLElement, value: any) => {
  // Proteção: Não altera campos desabilitados/somente leitura
  if ((element as any).disabled || (element as any).readOnly) return;

  let descriptor: PropertyDescriptor | undefined;

  // Obtém o setter correto baseado no tipo do elemento para evitar 'Illegal invocation'
  if (element instanceof HTMLInputElement) {
      descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
  } else if (element instanceof HTMLSelectElement) {
      descriptor = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value');
  } else if (element instanceof HTMLTextAreaElement) {
      descriptor = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value');
  }

  // Chama o setter original do navegador
  if (descriptor && descriptor.set) {
      descriptor.set.call(element, value);
  } else {
      (element as any).value = value;
  }

  // Acorda o React e validadores
  element.dispatchEvent(new Event('input', { bubbles: true }));
  if (element instanceof HTMLSelectElement) {
      element.dispatchEvent(new Event('change', { bubbles: true }));
  }
};

/**
 * Define o estado 'checked' de um checkbox de forma absoluta e segura.
 * Diferente de .click(), esta função não inverte o estado (toggle), ela define exatamente o que foi pedido.
 * Usa o protótipo nativo para bypassar o React e dispara 'change' para notificar a aplicação.
 */
export const setNativeChecked = (element: HTMLInputElement, checked: boolean) => {
  if (element.disabled || element.readOnly) return;

  const descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "checked");
  if (descriptor && descriptor.set) {
      descriptor.set.call(element, checked);
  } else {
      element.checked = checked;
  }

  // Dispara apenas change. Não usa click() para evitar toggle acidental durante cargas de dados.
  element.dispatchEvent(new Event('change', { bubbles: true }));
};

// ============ LÓGICA DE CHECKBOX GROUP (MESTRE/DETALHE) ============

/**
 * Helper interno: Analisa os filhos de um grupo e atualiza o estado visual do Mestre.
 * Determina se o Mestre deve estar Checked (todos marcados), Unchecked (nenhum) ou Indeterminate (misto).
 */
const updateMasterState = (master: HTMLInputElement, form: HTMLElement) => {
  const groupName = master.dataset.checkboxMaster;
  if (!groupName) return;

  const children = Array.from(form.querySelectorAll<HTMLInputElement>(`input[type="checkbox"][name="${groupName}"]`));
  if (children.length === 0) return;

  const checkedCount = children.filter(c => c.checked).length;

  if (checkedCount === 0) {
    master.checked = false;
    master.indeterminate = false;
  } else if (checkedCount === children.length) {
    master.checked = true;
    master.indeterminate = false;
  } else {
    // Indeterminado: Quando nem todos estão marcados (ex: seleção parcial ou item disabled desmarcado)
    master.checked = false;
    master.indeterminate = true;
  }
};

/**
 * Inicializa o estado visual de todos os checkboxes Mestres dentro de um container.
 * Deve ser chamado ao montar o formulário ou após resetar/carregar dados.
 */
export const initializeCheckboxMasters = (root: HTMLElement) => {
  const masters = root.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-checkbox-master]');
  masters.forEach(master => {
    const context = master.form || root;
    updateMasterState(master, context as HTMLElement);
  });
};

/**
 * Gerencia a interação em grupos de Checkbox (Selecionar Todos).
 * Pode ser acionado pelo clique no Mestre ou nos Filhos.
 */
export const syncCheckboxGroup = (target: HTMLInputElement, form: HTMLElement) => {
  // CASO A: Usuário clicou no Mestre (Select All)
  if (target.dataset.checkboxMaster) {
    const groupName = target.dataset.checkboxMaster;
    const children = Array.from(form.querySelectorAll<HTMLInputElement>(`input[type="checkbox"][name="${groupName}"]`));
    
    // Filtra apenas os habilitados para decisão lógica
    const enabledChildren = children.filter(child => !child.disabled && !child.readOnly);
    
    // Regra de "Toggle Inteligente":
    // Se existir ALGUM filho habilitado que está desmarcado -> A intenção é MARCAR TODOS.
    // Se TODOS os habilitados já estão marcados -> A intenção é DESMARCAR TODOS.
    const shouldCheckAll = enabledChildren.some(child => !child.checked);
    
    enabledChildren.forEach(child => {
      // Aplica o estado desejado apenas se necessário, usando setter seguro
      if (child.checked !== shouldCheckAll) {
        setNativeChecked(child, shouldCheckAll);
      }
    });
    
    // Recalcula o mestre no final para refletir a realidade (considerando itens disabled que não mudaram)
    updateMasterState(target, form);
    return;
  }

  // CASO B: Usuário clicou num Filho
  // Atualiza o Mestre correspondente para refletir o novo estado do grupo
  if (target.name) {
    const master = form.querySelector<HTMLInputElement>(`input[type="checkbox"][data-checkbox-master="${target.name}"]`);
    if (master) {
      updateMasterState(master, form);
    }
  }
};