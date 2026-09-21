import type { Test } from '@lvce-editor/test-with-playwright'

import { openMarkdownPreview } from './_markdown-preview.ts'

export const name = 'markdown-preview-should-render-table'

export const test: Test = async (api) => {
  const markdown = '| Name | Value |\n| --- | --- |\n| alpha | 1 |\n| beta | 2 |'
  await openMarkdownPreview(api, markdown)
}
