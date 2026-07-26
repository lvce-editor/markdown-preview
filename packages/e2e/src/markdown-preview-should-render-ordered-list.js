import { openMarkdownPreview } from './_markdown-preview.js'

export const name = 'markdown-preview-should-render-ordered-list'

export const test = async (api) => {
  await openMarkdownPreview(api, '1. first\n2. second\n3. third')
}
