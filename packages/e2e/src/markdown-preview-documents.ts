import type { Test } from '@lvce-editor/test-with-playwright'
import { openMarkdownPreview } from './_markdown-preview.ts'

export const name = 'markdown-preview-documents'

export const test: Test = async ({ FileSystem, Main, Command, Locator, expect }) => {
  const firstUri = await openMarkdownPreview({ FileSystem, Command, Locator, expect }, '# First document', 'first.md')
  const element1 = Locator('.MarkdownPreview h1')
  await expect(element1).toHaveText('First document')
  await openMarkdownPreview({ FileSystem, Command, Locator, expect }, '# Second document', 'second.md')
  const element2 = Locator('.MarkdownPreview h1')
  await expect(element2).toHaveText('Second document')
  await Main.closeAllEditors()
  await Command.execute('Main.openInput', {
    editorInput: { providerId: 'builtin.markdown-preview', type: 'webview', uri: firstUri },
    focus: true,
    preview: false,
  })
  const element3 = Locator('.MarkdownPreview h1')
  await expect(element3).toHaveText('First document')
  const element4 = Locator('.WebViewIframe')
  await expect(element4).toHaveCount(0)
}
