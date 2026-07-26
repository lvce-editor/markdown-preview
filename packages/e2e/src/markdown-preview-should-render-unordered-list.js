import { openMarkdownPreview } from './_markdown-preview.js'

export const name = 'markdown-preview-should-render-unordered-list'

export const test = async (api) => {
  await openMarkdownPreview(api, '- alpha\n- beta\n- gamma')
}
