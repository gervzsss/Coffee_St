import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Allow uppercase vars and 'motion' (used in JSX as <motion.div>)
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]|^motion$' }],
      // Allow context exports alongside providers (common React pattern)
      'react-refresh/only-export-components': ['warn', { allowExportNames: ['AuthContext', 'CartContext', 'ToastContext', 'AdminAuthContext'] }],
      // Allow setState in effects for data fetching (common pattern with useCallback)
      'react-hooks/set-state-in-effect': 'off',
      // Allow impure functions in useMemo/useState initializers
      'react-hooks/purity': 'off',
    },
  },
  // Disable fast refresh warnings for entry point
  {
    files: ['**/main.jsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
