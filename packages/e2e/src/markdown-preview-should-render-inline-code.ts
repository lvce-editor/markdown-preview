import type { Test } from '@lvce-editor/test-with-playwright'

import { openMarkdownPreview } from './_markdown-preview.ts'

export const name = 'markdown-preview-should-render-inline-code'

export const test: Test = async (api) => {
  await openMarkdownPreview(api, 'Run `npm test` before committing.')
}
