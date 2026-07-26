import { openMarkdownPreview } from './_markdown-preview.js'

export const name = 'markdown-preview-should-render-task-list'

export const test = async (api) => {
  await openMarkdownPreview(api, '- [x] complete\n- [ ] pending')
}
