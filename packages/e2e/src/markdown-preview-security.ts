import type { Test } from '@lvce-editor/test-with-playwright'
import { openMarkdownPreview } from './_markdown-preview.ts'

export const name = 'markdown-preview-security'

export const test: Test = async ({ FileSystem, Command, Locator, expect }) => {
  await openMarkdownPreview(
    { FileSystem, Command, Locator, expect },
    '<script>document.body.remove()</script>\n\n<img src="x" onerror="document.body.remove()">\n\n<a href="java&#x09;script:alert(1)">bad</a>\n\n<iframe srcdoc="evil"></iframe>\n\n<style>body{display:none}</style>\n\n# Still visible',
  )
  const element1 = Locator('.MarkdownPreview h1')
  await expect(element1).toHaveText('Still visible')
  const unsafe = Locator(
    '.MarkdownPreview script, .MarkdownPreview iframe, .MarkdownPreview style, .MarkdownPreview [onerror], .MarkdownPreview [href]',
  )
  await expect(unsafe).toHaveCount(0)
}
