# Performance

## Filosofia

O React Hybrid Form é pensado para cenários de alta carga:
- Formulários longos.
- Tabelas com dezenas de colunas.
- Listas com 10k+ registros.

Pilares de performance:
- Inputs **uncontrolled**.
- Estado do formulário no DOM, não no React.
- Virtualização para grandes coleções.
- Mínimo de re-renders durante digitação.

---

## Uncontrolled vs Controlled

### Controlled

- Cada `onChange` dispara `setState`.
- Cada digitação pode re-renderizar o formulário.
- Boa ergonomia, mas pode degradar em formulários grandes.

### Uncontrolled (abordagem da lib)

- O próprio input gerencia seu valor interno.
- O React orquestra validação e submissão.
- Leitura dos valores é feita "on demand" (submit, validação explícita).

Benefícios:
- Menos trabalho para o reconciliador do React.
- Menos garbage e menos GC pressure.
- Digitação fluida mesmo com muitos campos.

---

## Ciclo de Vida do Formulário

1. Usuário digita livremente (sem re-renders).
2. Em eventos-chave (submit, blur, validação manual), a lib:
   - Percorre o DOM.
   - Lê os valores com base nos nomes (`name`).
   - Monta o objeto tipado final.

Esse padrão é similar ao HTML clássico, com ergonomia extra do React por cima.

---

## Virtualização de Listas

Para listas grandes (10.000+ itens), usar `useVirtualizer` evita renderização de todos os itens de uma vez.

```tsx
const { virtualItems, containerProps, wrapperProps } = useVirtualizer({
  count: data.length,
  estimateSize: () => 56,
  overscan: 5,
});
```

Características:
- Somente os itens visíveis + overscan são renderizados.
- Layout fluido (60fps) em scrolls grandes.
- Lida bem com datasets grandes em tabelas e grids.

### Persistência Híbrida

Em cenários virtualizados:
- Os campos visíveis continuam no DOM.
- Os dados da lista completa vivem em memória (estado, store, refs).

Na submissão:
- O header (filtros, campos fixos) é lido do DOM.
- As linhas são obtidas da fonte de verdade em memória.
- O `onSubmit` faz o merge desses dois mundos.

---

## Mantendo o Formulário Leve

Boas práticas para evitar re-renders desnecessários:

- Use `React.memo` em componentes pesados do formulário.
- Evite estados locais desnecessários próximos dos inputs.
- Use contextos segmentados em vez de um único contexto gigante.
- Prefira hooks especializados (ex.: `useList`, `useTable`) para encapsular lógica.

---

## Medindo e Otimizando

Sugestões de análise:

- **React DevTools Profiler**:
  - Compare "before/after" de mudanças de arquitetura.
  - Veja quais componentes renderizam ao digitar.

- **Ferramentas de performance do navegador**:
  - Meça FPS ao rolar listas longas.
  - Verifique tempo de script em perfis de CPU.

- **Testes reais**:
  - Simule formulários com centenas de campos.
  - Teste lista/tabela com 50k+ registros usando `useVirtualizer`.
