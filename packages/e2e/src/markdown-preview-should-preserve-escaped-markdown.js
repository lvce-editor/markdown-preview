import { openMarkdownPreview } from './_markdown-preview.js'

export const name = 'markdown-preview-should-preserve-escaped-markdown'

export const test = async (api) => {
  await openMarkdownPreview(api, '\\*literal asterisks\\* and \\# literal hash')
}
