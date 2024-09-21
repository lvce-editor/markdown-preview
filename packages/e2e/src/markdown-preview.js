export const name = 'markdown-preview'

export const test = async ({ FileSystem, Main, Editor, Locator, expect }) => {
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
  await Main.openUri(`${tmpDir}/test.md`)

  // assert
  const webView = Locator('.WebView')
  await expect(webView).toBeVisible()
}
