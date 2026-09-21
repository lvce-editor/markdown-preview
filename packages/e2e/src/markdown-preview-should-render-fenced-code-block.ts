import type { Test } from '@lvce-editor/test-with-playwright'

import { openMarkdownPreview } from './_markdown-preview.ts'

export const name = 'markdown-preview-should-render-fenced-code-block'

export const test: Test = async (api) => {
  const markdown = ['```javascript', 'const answer = 42', '```'].join('\n')
  await openMarkdownPreview(api, markdown)
}
