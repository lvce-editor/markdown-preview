import type { Test } from '@lvce-editor/test-with-playwright'

import { openMarkdownPreview } from './_markdown-preview.ts'

export const name = 'markdown-preview'

export const test: Test = async (api) => {
  await openMarkdownPreview(
    api,
    `## test markdown

- one
- two
- three
`,
  )
}
