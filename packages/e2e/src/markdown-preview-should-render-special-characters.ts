import type { Test } from '@lvce-editor/test-with-playwright'

import { openMarkdownPreview } from './_markdown-preview.ts'

export const name = 'markdown-preview-should-render-special-characters'

export const test: Test = async (api) => {
  await openMarkdownPreview(api, 'Fish & chips, 5 < 7, and 8 > 3.')
}
