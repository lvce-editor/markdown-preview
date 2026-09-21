import type { Test } from '@lvce-editor/test-with-playwright'

import { openMarkdownPreview } from './_markdown-preview.ts'

export const name = 'markdown-preview-should-render-image'

export const test: Test = async (api) => {
  await openMarkdownPreview(api, '![Preview image](https://example.com/preview.png "Preview")')
}
