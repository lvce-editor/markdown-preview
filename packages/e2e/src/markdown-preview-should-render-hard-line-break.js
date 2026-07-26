import { openMarkdownPreview } from './_markdown-preview.js'

export const name = 'markdown-preview-should-render-hard-line-break'

export const test = async (api) => {
  await openMarkdownPreview(api, 'first line  \nsecond line')
}
