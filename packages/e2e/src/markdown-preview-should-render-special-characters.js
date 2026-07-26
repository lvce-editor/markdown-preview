import { openMarkdownPreview } from './_markdown-preview.js'

export const name = 'markdown-preview-should-render-special-characters'

export const test = async (api) => {
  await openMarkdownPreview(api, 'Fish & chips, 5 < 7, and 8 > 3.')
}
