import globals from "globals";
import pluginJs from "@eslint/js";
import pluginImport from "eslint-plugin-import";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  {
    languageOptions: { globals: globals.node },
    plugins: {
      'import': pluginImport,
    },
    rules: {
      'no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_'
        }
      ],
      'import/no-unresolved': ['error'],
      'import/named': ['error'],
      'import/default': ['error'],
    }
  }
];