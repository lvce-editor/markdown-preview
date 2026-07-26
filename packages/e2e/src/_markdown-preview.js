const waitForVisible = async (locator, expect) => {
  let lastError
  for (let i = 0; i < 20; i++) {
    try {
      await expect(locator).toBeVisible()
      return
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
  throw lastError
}

export const openMarkdownPreview = async ({ Command, FileSystem, Locator, expect }, markdown) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.md`
  await FileSystem.writeFile(uri, markdown)
  await Command.execute('Main.openInput', {
    editorInput: {
      providerId: 'builtin.markdown-preview',
      type: 'webview',
      uri,
    },
    focus: true,
    preview: false,
  })
  const webView = Locator('.WebViewIframe')
  await waitForVisible(webView, expect)
  await expect(webView).toHaveAttribute('title', 'Markdown Preview')
}
