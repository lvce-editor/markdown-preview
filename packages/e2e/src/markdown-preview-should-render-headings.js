import { openMarkdownPreview } from './_markdown-preview.js'

export const name = 'markdown-preview-should-render-headings'

export const test = async (api) => {
  await openMarkdownPreview(api, '# Primary heading\n\n###### Smallest heading')
}
