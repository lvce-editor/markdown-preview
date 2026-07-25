export const name = 'markdown-preview'

export const test = async ({ Command, FileSystem, Main, Locator, QuickPick, expect }) => {
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
  await Main.openUri(`${tmpDir}/test.md`)
  const reopenPromise = Command.execute('Main.reopenEditorWith')
  await expect(Locator('.QuickPick')).toBeVisible()
  await QuickPick.selectItem('Markdown Preview')
  await reopenPromise

  // assert
  const webView = Locator('.WebViewIframe')
  await expect(webView).toBeVisible()
}
