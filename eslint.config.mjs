import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import nextPlugin from '@next/eslint-plugin-next';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['.next/**', 'node_modules/**', 'coverage/**', 'dist/**'],
  },
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
        project: './tsconfig.json',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: pluginReact,
      '@next/next': nextPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      /* === From TS ESLint, React, Next Core Web Vitals === */
      ...tseslint.configs.recommended[0].rules,
      ...pluginReact.configs.flat.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      /* === Adjustments for modern React/Next === */
      'react/react-in-jsx-scope': 'off',

      /* === Custom rules === */
      'react-hooks/exhaustive-deps': 'off',
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 1 }],
      '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],

      /* === Unified unused vars handling === */
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      /* === Padding rules === */
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'function' },
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
      ],

      /* === General best practices === */
      eqeqeq: 'error',
      'no-console': 'warn',
      curly: 'error',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      react: pluginReact,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
    },
  },
]);
