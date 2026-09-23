import type { Test } from '@lvce-editor/test-with-playwright'

type TestApi = Parameters<Test>[0]

export const openMarkdownPreview = async (
  { FileSystem, Command, Locator, expect }: TestApi,
  markdown: string,
  filename = 'test.md',
) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/${filename}`
  await FileSystem.writeFile(uri, markdown)
  await Command.execute('Main.openInput', {
    editorInput: { providerId: 'builtin.markdown-preview', type: 'webview', uri },
    focus: true,
    preview: false,
  })
  await expect(Locator('.MarkdownPreview')).toBeVisible()
  await expect(Locator('.WebViewIframe')).toHaveCount(0)
  return uri
}
