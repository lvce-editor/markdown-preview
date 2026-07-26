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

<script>
console.log("hello world")
</script>
`,
  )

  // act
  await Command.execute('Main.openUri', `${tmpDir}/test.md`, true, {
    opener: 'builtin.markdown-preview',
  })

  // assert
  const webView = Locator('.WebViewIframe')
  await waitForVisible(webView, expect)
}
