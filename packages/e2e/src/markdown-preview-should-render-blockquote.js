import { openMarkdownPreview } from './_markdown-preview.js'

export const name = 'markdown-preview-should-render-blockquote'

export const test = async (api) => {
  await openMarkdownPreview(api, '> A quoted paragraph')
}
