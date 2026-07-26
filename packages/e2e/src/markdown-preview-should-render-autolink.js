import { openMarkdownPreview } from './_markdown-preview.js'

export const name = 'markdown-preview-should-render-autolink'

export const test = async (api) => {
  await openMarkdownPreview(api, '<https://example.com/docs>')
}
