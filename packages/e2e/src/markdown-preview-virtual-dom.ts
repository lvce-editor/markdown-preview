import type { Test } from '@lvce-editor/test-with-playwright'
import { openMarkdownPreview } from './_markdown-preview.ts'

export const name = 'markdown-preview-virtual-dom'

export const test: Test = async ({ FileSystem, Command, Locator, expect }) => {
  await openMarkdownPreview(
    { FileSystem, Command, Locator, expect },
    '# Heading\n\n- first\n- second\n\n```js\nconst answer = 42\n```\n\n[Link](https://example.com)\n\n![Picture](https://example.com/image.png)\n\n| A | B |\n| - | - |\n| 1 | 2 |',
  )
  const element1 = Locator('.MarkdownPreview h1')
  await expect(element1).toHaveText('Heading')
  const element2 = Locator('.MarkdownPreview li')
  await expect(element2).toHaveCount(2)
  const element3 = Locator('.MarkdownPreview pre code')
  await expect(element3).toHaveText('const answer = 42\n')
  const element4 = Locator('.MarkdownPreview a')
  await expect(element4).toHaveAttribute('href', 'https://example.com')
  const element5 = Locator('.MarkdownPreview img')
  await expect(element5).toHaveAttribute('alt', 'Picture')
  const element6 = Locator('.MarkdownPreview td')
  await expect(element6).toHaveCount(2)
}
