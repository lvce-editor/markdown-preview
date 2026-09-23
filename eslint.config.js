import { defineConfig } from 'eslint/config'
import * as config from '@lvce-editor/eslint-config'

export default defineConfig([
  ...config.default,
  ...config.recommendedActions,
  {
    files: ['.github/workflows/release.yml'],
    rules: {
      'github-actions/action-versions': 'off',
      'github-actions/ci-versions': 'off',
      'github-actions/no-e2e-in-release': 'off',
      'github-actions/npm-task-order': 'off',
      'github-actions/release-action': 'off',
    },
  },
  {
    files: ['.github/workflows/pr.yml', '.github/workflows/ci.yml'],
    rules: {
      // These job names are part of the protected branch's required-check contract.
      'github-actions/ci-versions': 'off',
    },
  },
  {
    files: ['packages/e2e/**/*.ts'],
    rules: {
      'e2e/no-imports': 'off',
      'e2e/no-timeouts': 'off',
    },
  },
  {
    files: ['packages/extension/extension.json'],
    rules: {
      'extension-json/non-empty-languages': 'off',
    },
  },
  {
    rules: {
      'e18e/prefer-spread-syntax': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@cspell/spellchecker': 'off',
      'no-control-regex': 'off',
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-interfaces': 'off',
      'perfectionist/sort-objects': 'off',
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/regex-complexity': 'off',
      'sonarjs/super-linear-regex': 'off',
      'unicorn/escape-case': 'off',
      'unicorn/no-global-object-property-assignment': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/numeric-separators-style': 'off',
      'unicorn/prefer-await': 'off',
      'unicorn/prefer-number-coercion': 'off',
      'unicorn/prefer-string-replace-all': 'off',
      'unicorn/prefer-unicode-code-point-escapes': 'off',
    },
  },
])
