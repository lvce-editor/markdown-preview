import { openMarkdownPreview } from './_markdown-preview.js'

export const name = 'markdown-preview-should-render-inline-code'

export const test = async (api) => {
  await openMarkdownPreview(api, 'Run `npm test` before committing.')
}
