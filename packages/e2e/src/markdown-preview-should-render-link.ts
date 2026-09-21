import type { Test } from '@lvce-editor/test-with-playwright'

import { openMarkdownPreview } from './_markdown-preview.ts'

export const name = 'markdown-preview-should-render-link'

export const test: Test = async (api) => {
  await openMarkdownPreview(api, '[LVCE](https://lvce-editor.github.io "LVCE Editor")')
}
