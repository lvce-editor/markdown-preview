import type { Test } from '@lvce-editor/test-with-playwright'

import { openMarkdownPreview } from './_markdown-preview.ts'

export const name = 'markdown-preview-should-render-blockquote'

export const test: Test = async (api) => {
  await openMarkdownPreview(api, '> A quoted paragraph')
}
