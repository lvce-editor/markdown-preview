import type { Test } from '@lvce-editor/test-with-playwright'

import { openMarkdownPreview } from './_markdown-preview.ts'

export const name = 'markdown-preview-should-render-nested-list'

export const test: Test = async (api) => {
  await openMarkdownPreview(api, '- parent\n  - child\n    - grandchild')
}
