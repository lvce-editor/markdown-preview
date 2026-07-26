import { openMarkdownPreview } from './_markdown-preview.js'

export const name = 'markdown-preview-should-render-link'

export const test = async (api) => {
  await openMarkdownPreview(api, '[LVCE](https://lvce-editor.github.io "LVCE Editor")')
}
