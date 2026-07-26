import { openMarkdownPreview } from './_markdown-preview.js'

export const name = 'markdown-preview-should-render-table'

export const test = async (api) => {
  const markdown = '| Name | Value |\n| --- | --- |\n| alpha | 1 |\n| beta | 2 |'
  await openMarkdownPreview(api, markdown)
}
