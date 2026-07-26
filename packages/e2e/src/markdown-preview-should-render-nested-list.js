import { openMarkdownPreview } from './_markdown-preview.js'

export const name = 'markdown-preview-should-render-nested-list'

export const test = async (api) => {
  await openMarkdownPreview(api, '- parent\n  - child\n    - grandchild')
}
