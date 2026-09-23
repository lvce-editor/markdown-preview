import type { Test } from '@lvce-editor/test-with-playwright'
import { openMarkdownPreview } from './_markdown-preview.ts'

export const name = 'markdown-preview-virtual-dom'

export const test: Test = async (api) => {
  const { Locator, expect } = api
  await openMarkdownPreview(
    api,
    '# Heading\n\n- first\n- second\n\n```js\nconst answer = 42\n```\n\n[Link](https://example.com)\n\n![Picture](https://example.com/image.png)\n\n| A | B |\n| - | - |\n| 1 | 2 |',
  )
  await expect(Locator('.MarkdownPreview h1')).toHaveText('Heading')
  await expect(Locator('.MarkdownPreview li')).toHaveCount(2)
  await expect(Locator('.MarkdownPreview pre code')).toHaveText('const answer = 42\n')
  await expect(Locator('.MarkdownPreview a')).toHaveAttribute('href', 'https://example.com')
  await expect(Locator('.MarkdownPreview img')).toHaveAttribute('alt', 'Picture')
  await expect(Locator('.MarkdownPreview td')).toHaveCount(2)
}
