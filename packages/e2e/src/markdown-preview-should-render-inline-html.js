import { openMarkdownPreview } from './_markdown-preview.js'

export const name = 'markdown-preview-should-render-inline-html'

export const test = async (api) => {
  await openMarkdownPreview(api, '<section><span data-kind="custom">custom html</span></section>')
}
