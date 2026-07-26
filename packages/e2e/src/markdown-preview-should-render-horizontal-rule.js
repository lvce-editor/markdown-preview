import { openMarkdownPreview } from './_markdown-preview.js'

export const name = 'markdown-preview-should-render-horizontal-rule'

export const test = async (api) => {
  await openMarkdownPreview(api, 'before\n\n---\n\nafter')
}
