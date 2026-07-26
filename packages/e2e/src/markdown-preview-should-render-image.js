import { openMarkdownPreview } from './_markdown-preview.js'

export const name = 'markdown-preview-should-render-image'

export const test = async (api) => {
  await openMarkdownPreview(api, '![Preview image](https://example.com/preview.png "Preview")')
}
