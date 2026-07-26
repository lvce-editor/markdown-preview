import { openMarkdownPreview } from './_markdown-preview.js'

export const name = 'markdown-preview-should-render-fenced-code-block'

export const test = async (api) => {
  const markdown = ['```javascript', 'const answer = 42', '```'].join('\n')
  await openMarkdownPreview(api, markdown)
}
