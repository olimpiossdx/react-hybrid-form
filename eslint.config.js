import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist'] },
  // Configurações base
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Desativa regras do ESLint que conflitam com o Prettier
  prettierConfig,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.app.json'],
       ecmaFeatures: { jsx: true },
    },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react: react,
      'simple-import-sort': simpleImportSort,
      prettier: prettierPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
      'react-refresh/only-export-components': 'off', // Desabilitado para evitar alertas no hot-reload

      // Integração do Prettier (Isso faz o --fix corrigir quebras de linha e estilo)
      'prettier/prettier': [
        'error',
        {
          printWidth: 140, // Limite de colunas
          tabWidth: 2, // Indentação
          singleQuote: true, // Aspas simples
          trailingComma: 'all', // Vírgula pendente
          arrowParens: 'always',
          semi: true, // Ponto e vírgula obrigatório
          endOfLine: 'auto',
        },
      ],

      // Regras personalizadas e Exceções
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'off', // Permite usar ' sem precisar de &apos;
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off', // Permite @ts-ignore
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['off', { allow: ['warn', 'error'] }],

      // A regra 'max-len' do ESLint é substituída pelo 'printWidth' do Prettier acima.
      // Mantemos eqeqeq e curly pois são regras de lógica, não apenas estilo.
      eqeqeq: 'error',
      curly: 'error',

      // Ordenação de Imports
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'], // Side effects
            ['^react', '^@?\\w'], // Libs
            ['^@/', '^\\.', '^\\.\\.'], // Internos
            ['^.+\\.s?css$'], // Estilos
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
);
