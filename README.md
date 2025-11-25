Com certeza. Este README consolida toda a arquitetura, as decisões técnicas e as soluções de problemas que implementamos até agora (como a validação do Autocomplete, a recursão do StarRating e a performance do MutationObserver).

-----

# 🚀 React Hybrid Forms (v4.12)

Uma arquitetura de formulários para React focada em **performance**, **acessibilidade** e uso nativo da **API de Validação do DOM**.

## 🎯 Filosofia

Diferente de bibliotecas que controlam cada keystroke no estado do React (causando re-renderizações desnecessárias), esta solução adota uma abordagem **Híbrida/Não-Controlada (Uncontrolled)**:

1.  **DOM como Fonte da Verdade:** Os valores ficam nos inputs HTML, não no State do React.
2.  **Validação Nativa Primeiro:** Utilizamos `checkValidity()` e `reportValidity()` do browser para uma experiência de UI consistente e performática.
3.  **React para Lógica de Negócios:** O React entra em cena apenas para orquestrar submissões, validações complexas (custom rules) e componentes ricos.
4.  **Observer Pattern:** Um `MutationObserver` otimizado detecta campos adicionados dinamicamente sem varrer o DOM inteiro.

-----

## 📂 Estrutura do Projeto

```bash
src/
├── hooks/
│   └── useForm.ts        # O cérebro. Gerencia validação, submit e leitura do DOM.
├── components/
│   ├── Autocomplete.tsx  # Select com busca, acessível e validável.
│   ├── StarRating.tsx    # Avaliação com estrelas usando SVGs e input âncora.
│   └── TabButton.tsx     # Botão de navegação (Stateless).
├── utils/
│   ├── props.ts          # Definições de Tipos (TypeScript).
│   └── utilities.ts      # Helpers para manipulação de objetos profundos e DOM.
└── App.tsx               # Exemplo de uso com abas e cenários.
```

-----

## 🛠️ O Hook `useForm`

O hook central que conecta o formulário HTML à lógica do React.

### Funcionalidades Chave:

  * **`getValue(prefix?)`**: Lê os valores diretamente do DOM. Suporta aninhamento profundo (`user.address.city`) e Arrays (`items[0].name`).
  * **`handleSubmit(callback)`**: Intercepta o envio, roda validações customizadas, foca no primeiro erro e, se tudo ok, chama o callback com um JSON estruturado.
  * **`setValidators({ ... })`**: Permite injetar regras de negócio complexas que o HTML `required` ou `pattern` não cobrem.
  * **`resetSection(prefix, values)`**: Reseta partes específicas do formulário (útil para botões "Cancelar" em edições parciais).
  * **Performance:** Utiliza um `MutationObserver` otimizado que escaneia apenas nós adicionados (`addedNodes`), evitando gargalos em formulários grandes.

### Exemplo de Uso:

```tsx
const { handleSubmit, getValue, setValidators } = useForm("meu-form-id");

const onSubmit = (data) => console.log(data);

return (
  <form id="meu-form-id" onSubmit={handleSubmit(onSubmit)}>
    <input name="user.name" required />
    <button type="submit">Enviar</button>
  </form>
);
```

-----

## 🧩 Componentes Customizados

Estes componentes foram desenhados para se comportarem como inputs nativos, integrando-se perfeitamente ao fluxo de validação do browser.

### 1\. Autocomplete (`Autocomplete.tsx`)

Um componente de seleção com filtro, mas que mantém um `<select>` oculto para garantir a integridade dos dados.

  * **Pattern "Shadow Select":** Mantém um `<select>` oculto (`clip: rect(0,0,0,0)`) sincronizado. Isso garante que se o JS falhar, o dado ainda existe.
  * **Acessibilidade:** Suporte completo a teclado (Setas, Enter, Tab, Blur).
  * **Correção de Validação:** Implementa lógica para forçar a revalidação visual (borda verde/vermelha) imediatamente após seleção via teclado, contornando "race conditions" do browser.
  * **Uncontrolled Mode:** Usa `defaultValue` no select interno para evitar resets indesejados ao re-renderizar o componente pai.

### 2\. StarRating (`StarRating.tsx`)

Componente de avaliação visual que usa a API de validação nativa.

  * **Pattern "Anchor Input":** Usa um input invisível (`opacity: 0`, `w-full`, `bottom-0`) posicionado sobre as estrelas.
      * *Por que?* Para que o balão de erro nativo ("Preencha este campo") aponte corretamente para as estrelas, e não para um pixel aleatório.
  * **Sem Recursão:** Lógica de validação ajustada para evitar o erro `InternalError: too much recursion` ao usar `reportValidity` dentro de um evento `onInvalid`.
  * **Acessibilidade:** Container com `tabindex="0"` e `role="slider"`, permitindo navegação via teclado.

-----

## ⚙️ Utilitários (`utilities.ts`)

Funções puras e robustas para manipulação de dados e DOM.

  * **`getFormFields(root)`**: Retorna um Array (não NodeList) de inputs válidos, filtrando botões e elementos irrelevantes.
  * **`setNestedValue` / `getNestedValue`**: Algoritmo capaz de transformar strings de caminho (`"clientes[0].endereco.rua"`) em objetos JavaScript reais e vice-versa.
  * **`parseFieldValue`**: Normaliza valores, convertendo strings numéricas para `Number`, tratando `Checkbox` como booleanos e garantindo que `Radio` buttons só retornem valor se marcados.

-----

## 🚨 Soluções de Problemas Recentes

Documentação de bugs críticos que foram resolvidos nesta versão:

1.  **Bug do Reset no Autocomplete:**

      * *Problema:* Ao clicar em "Salvar", o Autocomplete limpava o valor.
      * *Causa:* A prop `options` era recriada a cada render do pai, e o select oculto era Controlado.
      * *Solução:* Movemos `options` para uma constante externa e tornamos o select interno **Não-Controlado** (`defaultValue`).

2.  **Erro de Recursão no StarRating:**

      * *Problema:* O navegador travava com "Too much recursion".
      * *Causa:* Chamar `reportValidity()` dentro de um handler `onInvalid`.
      * *Solução:* Apenas definir a mensagem (`setCustomValidity`) e deixar o navegador exibir o balão naturalmente.

3.  **Foco de Erro em Componentes Custom:**

      * *Problema:* O foco ia para o input oculto, que não scrollava a tela.
      * *Solução:* O `useForm` agora procura por elementos "irmãos" visíveis ou com `tabindex="0"` para focar quando um input oculto está inválido.

-----

## 🚀 Como Rodar

1.  Copie a pasta `src` para seu projeto React.
2.  Instale as dependências (apenas React e TypeScript, sem libs de form externas).
3.  Importe o `useForm` e comece a criar formulários performáticos\!