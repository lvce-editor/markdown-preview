import type { Test } from '@lvce-editor/test-with-playwright'

import { openMarkdownPreview } from './_markdown-preview.ts'

export const name = 'markdown-preview-should-render-inline-html'

export const test: Test = async (api) => {
  await openMarkdownPreview(api, '<section><span data-kind="custom">custom html</span></section>')
}
