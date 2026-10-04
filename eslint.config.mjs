import tseslint from 'typescript-eslint';
import stylisticTs from '@stylistic/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import compat from 'eslint-plugin-compat';

export default tseslint.config(
  {
    ignores: ['esm/', 'cjs/', 'dist/'],
  },
  ...tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,
  compat.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.ts'],
    plugins: {
      '@stylistic/ts': stylisticTs,
    },
    rules: {
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
    },
  },
);
