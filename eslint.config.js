// // eslint.config.js
// import js from '@eslint/js';
// import react from 'eslint-plugin-react';
// import reactHooks from 'eslint-plugin-react-hooks';
// import prettier from 'eslint-plugin-prettier';
// import tsParser from '@typescript-eslint/parser';
// import tsPlugin from '@typescript-eslint/eslint-plugin';

// /** @type {import("eslint").Linter.FlatConfig[]} */
// export default [
//   {
//     ignores: ['node_modules/**', 'dist/**'],
//   },
//   js.configs.recommended,
//   {
//     files: ['**/*.{ts,tsx}'],
//     languageOptions: {
//       parser: tsParser,
//       parserOptions: {
//         ecmaFeatures: {
//           jsx: true,
//         },
//         ecmaVersion: 'latest',
//         sourceType: 'module',
//       },
//       globals: {
//         JSX: true,
//       },
//     },
//     plugins: {
//       react,
//       'react-hooks': reactHooks,
//       prettier,
//       '@typescript-eslint': tsPlugin,
//     },
//     rules: {
//       // Base recommended rules
//       ...react.configs.recommended.rules,
//       ...reactHooks.configs.recommended.rules,
//       ...tsPlugin.configs.recommended.rules,

//       // Relaxed rules
//       'prettier/prettier': 'warn',
//       '@typescript-eslint/no-unused-vars': [
//         'warn',
//         { argsIgnorePattern: '^_' },
//       ],
//       '@typescript-eslint/explicit-function-return-type': 'off',
//       '@typescript-eslint/explicit-module-boundary-types': 'off',
//       '@typescript-eslint/no-explicit-any': 'off',
//       '@typescript-eslint/no-inferrable-types': 'off',

//       'react/react-in-jsx-scope': 'off',
//       'react/prop-types': 'off',
//     },
//     settings: {
//       react: {
//         version: 'detect',
//       },
//     },
//   },
// ];
