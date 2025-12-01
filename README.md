-----

# 🚀 React Hybrid Form `v0.5.0`

Uma arquitetura de formulários para React focada em **alta performance**, **acessibilidade (a11y)** e uso robusto da **API de Validação Nativa do DOM**.

> **💡 Filosofia:** O estado do formulário vive no DOM, não no React. O React entra apenas para orquestrar validações complexas, componentes ricos e a submissão. Zero re-renders ao digitar.

-----

## ✨ Destaques da Versão

  - **🏎️ Performance Extrema:** Componentes não controlados (*Uncontrolled*) por padrão. Digitar em um input não causa re-renderização do formulário.
  - **🧠 Smart Validation:** Estratégia "Reward Early, Punish Late" com *Debounce* inteligente. Feedback imediato ao corrigir, feedback suave ao errar.
  - **🔄 Autocomplete Enterprise:** Suporte completo a **Busca Assíncrona**, **Paginação (Infinite Scroll)**, **Portals** e tratamento de erros.
  - **⭐ StarRating 2.0:** Totalmente acessível via teclado, customizável e reativo a resets externos.
  - **🛡️ Validação Híbrida:** Integração perfeita entre validação customizada JS e balões de erro nativos (`reportValidity`).
  - **✅ Checkbox Intelligence:** Gestão automática de grupos e estado "Indeterminado" via atributos HTML (`data-checkbox-master`), sem hooks manuais.
  - **🔌 Native Bypass:** Arquitetura interna robusta que permite alterar valores do DOM via código e "acordar" o React automaticamente.

-----

## 📦 Estrutura do Projeto

```text
src/
├── hooks/
│   └── useForm.ts        # O Core. Gerencia validação, submit, leitura do DOM, Debounce e Observer.
├── components/
│   ├── Autocomplete.tsx  # Input Async com Portal, filtro e Select Oculto.
│   ├── StarRating.tsx    # Avaliação acessível com Input Âncora.
│   └── TabButton.tsx     # Componente UI Stateless.
├── utils/
│   ├── props.ts          # Definições de Tipos (Path, PathValue).
│   └── utilities.ts      # Helpers de DOM, Parser, React Bypass e Lógica de Checkbox.
└── scenarios/
    ├── AsyncAutocompleteExample.tsx # Demo de API, Paginação e Edição.
    ├── CheckboxGroupForm.tsx        # Demo de Grupos e Ciclo de Vida.
    ├── ValidationFeedbackExample.tsx # Demo de UX de Validação.
    └── ...
```

-----

## 🛠️ Hook Core: `useForm`

Conecte o formulário HTML à lógica React com tipagem forte.

```tsx
import useForm from './hooks/useForm';

interface FormData {
  user: { name: string; age: number };
}

const MyForm = () => {
  const { handleSubmit, getValue, setValidators, resetSection } = useForm<FormData>("my-form-id");

  const onSubmit = (data) => {
    // data é inferido como FormData automaticamente
    console.log("JSON Submetido:", data);
  };

  return (
    <form id="my-form-id" onSubmit={handleSubmit(onSubmit)}>
      <input name="user.name" required />
      <button type="submit">Enviar</button>
    </form>
  );
};
```

-----

## 🧠 Lógica de Dados (`getValue`)

O sistema lê o DOM e converte para JSON estruturado automaticamente, inferindo tipos.

| Cenário HTML | Comportamento Interno | Resultado JSON |
| :--- | :--- | :--- |
| **Campos Simples** | `name="email"` | `{ "email": "..." }` |
| **Aninhado** | `name="user.city"` | `{ "user": { "city": "..." } }` |
| **Checkbox (Único)** | `name="terms"` (1 elemento no DOM) | `{ "terms": true }` (ou valor se definido) |
| **Checkbox (Grupo)** | `name="roles"` (2+ elementos no DOM) | `{ "roles": ["admin", "editor"] }` |

-----

## 🌳 Checkbox Groups Inteligentes

Crie grupos hierárquicos (Selecionar Todos) usando apenas atributos HTML.

```tsx
{/* O Mestre: Controla inputs com name="permissoes" */}
<label>
  <input type="checkbox" data-checkbox-master="permissoes" /> 
  Selecionar Todos
</label>

{/* Os Filhos */}
<input type="checkbox" name="permissoes" value="ler" />
<input type="checkbox" name="permissoes" value="escrever" />
<input type="checkbox" name="permissoes" value="excluir" disabled /> {/* Ignorado pelo Mestre */}
```

**Resultado JSON:** `{ "permissoes": ["ler", "escrever"] }`

-----

## 🔄 Ciclo de Vida: Load & Reset

Para carregar dados de uma API (Edição) ou cancelar alterações, use o `resetSection`.

> **Nota:** Graças ao mecanismo de **Native Bypass** (`setNativeValue`), o `resetSection` atualiza o DOM e dispara eventos que atualizam automaticamente qualquer estado React vinculado (Ilhas de Reatividade).

```tsx
const handleLoadData = () => {
    // Preenche o formulário e notifica componentes visuais
    resetSection("", DADOS_API); 
    
    // Dica: Se houver lógica condicional complexa, sincronize o estado explícito aqui também
    // setIsVisible(DADOS_API.hasExtraField);
};
```

-----

## 🎨 Padrões para Componentes Customizados

### Pattern 1: Shadow Select (`Autocomplete`)

1.  Mantenha um `<select>` oculto (`clip: rect(0,0,0,0)`) sincronizado.
2.  Use `defaultValue` no select para manter o componente **Uncontrolled**.
3.  Use **Portals** para renderizar a lista fora de containers com `overflow: hidden`.

### Pattern 2: Anchor Input (`StarRating`)

1.  Renderize um `<input>` com dimensões físicas (`w-full h-full`), mas transparente e atrás do visual (`z-0`).
2.  Mantenha `pointer-events-auto` para que o navegador reconheça o campo como validável e exiba o balão de erro nativo corretamente.

-----

## 🧪 Utilitários (`utilities.ts`)

Funções puras exportadas para uso geral:

  - `setNativeValue(element, value)`: Define valor e dispara eventos, burlando o bloqueio de Synthetic Events do React.
  - `getFormFields(root)`: Busca inputs válidos dentro de qualquer container.
  - `setNestedValue(obj, path, value)`: Cria objetos profundos a partir de strings de caminho.
  - `syncCheckboxGroup(target, form)`: Lógica central que sincroniza Mestres e Filhos.

### Licença

MIT