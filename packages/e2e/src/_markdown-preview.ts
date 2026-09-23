import type { Test } from '@lvce-editor/test-with-playwright'

type TestApi = Pick<Parameters<Test>[0], 'FileSystem' | 'Command' | 'Locator' | 'expect'>

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
  const element1 = Locator('.MarkdownPreview')
  await expect(element1).toBeVisible()
  const element2 = Locator('.WebViewIframe')
  await expect(element2).toHaveCount(0)
  return uri
}
