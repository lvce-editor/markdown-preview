import { openMarkdownPreview } from './_markdown-preview.js'

export const name = 'markdown-preview-should-render-strikethrough'

export const test = async (api) => {
  await openMarkdownPreview(api, 'This is ~~obsolete~~.')
}
