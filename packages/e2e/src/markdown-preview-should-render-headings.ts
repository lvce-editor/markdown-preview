import type { Test } from '@lvce-editor/test-with-playwright'

import { openMarkdownPreview } from './_markdown-preview.ts'

export const name = 'markdown-preview-should-render-headings'

export const test: Test = async (api) => {
  await openMarkdownPreview(api, '# Primary heading\n\n###### Smallest heading')
}
