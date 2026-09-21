import type { Test } from '@lvce-editor/test-with-playwright'

import { openMarkdownPreview } from './_markdown-preview.ts'

export const name = 'markdown-preview-should-render-horizontal-rule'

export const test: Test = async (api) => {
  await openMarkdownPreview(api, 'before\n\n---\n\nafter')
}
