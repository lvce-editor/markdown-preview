import type { Test } from '@lvce-editor/test-with-playwright'

type TestApi = Parameters<Test>[0]

export const openMarkdownPreview = async ({ FileSystem, MarkdownPreview }: TestApi, markdown: string) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.md`
  await FileSystem.writeFile(uri, markdown)
  await MarkdownPreview.open(uri)
}
