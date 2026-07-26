export const name = 'markdown-preview'

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

export const test = async ({ Command, FileSystem, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.md`,
    `## test markdown

- one
- two
- three
`,
  )

  // act
  await Command.execute('Main.openInput', {
    editorInput: {
      providerId: 'builtin.markdown-preview',
      type: 'webview',
      uri: `${tmpDir}/test.md`,
    },
    focus: true,
    preview: false,
  })
  // assert
  const webView = Locator('.WebViewIframe')
  await waitForVisible(webView, expect)
}
