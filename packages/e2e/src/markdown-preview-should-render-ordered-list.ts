import type { Test } from '@lvce-editor/test-with-playwright'

import { openMarkdownPreview } from './_markdown-preview.ts'

export const name = 'markdown-preview-should-render-ordered-list'

export const test: Test = async (api) => {
  await openMarkdownPreview(api, '1. first\n2. second\n3. third')
}
