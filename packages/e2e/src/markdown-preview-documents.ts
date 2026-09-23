import type { Test } from '@lvce-editor/test-with-playwright'
import { openMarkdownPreview } from './_markdown-preview.ts'

export const name = 'markdown-preview-documents'

export const test: Test = async (api) => {
  const { Main, Command, Locator, expect } = api
  const firstUri = await openMarkdownPreview(api, '# First document', 'first.md')
  await expect(Locator('.MarkdownPreview h1')).toHaveText('First document')
  await openMarkdownPreview(api, '# Second document', 'second.md')
  await expect(Locator('.MarkdownPreview h1')).toHaveText('Second document')
  await Main.closeAllEditors()
  await Command.execute('Main.openInput', {
    editorInput: { providerId: 'builtin.markdown-preview', type: 'webview', uri: firstUri },
    focus: true,
    preview: false,
  })
  await expect(Locator('.MarkdownPreview h1')).toHaveText('First document')
  await expect(Locator('.WebViewIframe')).toHaveCount(0)
}
