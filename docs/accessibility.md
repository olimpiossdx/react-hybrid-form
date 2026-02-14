# Acessibilidade (a11y)

## Princípios

O React Hybrid Form tenta aproveitar ao máximo:
- Recursos nativos de formulários HTML.
- Constraint Validation API.
- Semântica padrão (inputs, labels, buttons).

Isso ajuda:
- Leitores de tela.
- Navegação por teclado.
- Mensagens de erro consistentes entre navegadores.

---

## Constraint Validation API

Ao usar atributos como:

```html
<input name="email" type="email" required />
<input name="age" type="number" min="18" />
```

O navegador fornece:
- Mensagens de erro padrão.
- Informações de `ValidityState`.
- Foco automático no primeiro campo inválido.

A lib se apoia nisso para não reinventar todo o mecanismo de validação/exibição de erro.

---

## Shadow Inputs e Integridade no DOM

Alguns componentes "ricos" usam elementos ocultos para manter integridade do DOM:

- **DateRangePicker**:
  - Mantém dois `input[type="date"]` ocultos (`start` e `end`).
  - A interface rica controla esses inputs, que continuam validáveis pelo navegador.

- **Autocomplete**:
  - Usa um `select` ou `input hidden` para representar o valor real.
  - Garante que, para o formulário, ainda existe um campo nativo com um valor concreto.

Benefícios:
- A API de submissão e validação continua padronizada.
- Ferramentas de acessibilidade entendem o formulário sem hacks.

---

## Navegação por Teclado

Componentes interativos (Autocomplete, StarRating, Switch, Modais) seguem diretrizes de teclado:

- `Tab`/`Shift+Tab` para movimentar foco.
- Setas para navegar em listas (quando fizer sentido).
- `Enter`/`Space` para confirmar seleções.

Isso evita "travar" o usuário em elementos customizados.

---

## Mensagens de Erro

Erros são definidos via `setCustomValidity`, o que:
- Integra as mensagens ao mecanismo nativo de validação.
- Permite que leitores de tela anunciem o erro quando o campo recebe foco.
- Mantém a experiência coerente mesmo com validações customizadas.

Boas práticas:
- Mensagens objetivas ("Informe um CPF válido").
- Evitar excesso de texto técnico.

---

## Modais e Focus Trap

O sistema de modais cuida da experiência de foco:

- Foco inicial em um elemento relevante ao abrir o modal (ex.: primeiro botão de ação).
- **Focus trap**: o foco não "escapa" do modal enquanto ele estiver aberto.
- Suporte a `Escape` para fechamento (quando habilitado).

Isso evita que usuários de teclado ou leitores de tela fiquem "perdidos" fora do contexto atual.

---

## Testando Acessibilidade

Sugestões práticas:

- Use apenas teclado para navegar:
  - Tab por todos os campos.
  - Teste envio de formulário com campos inválidos.
- Rode ferramentas automatizadas (Lighthouse, axe, etc.).
- Teste com leitores de tela:
  - VoiceOver (macOS).
  - NVDA/JAWS (Windows).

Quanto mais próxima sua implementação estiver da semântica HTML padrão, mais simples é obter bons resultados de a11y.
