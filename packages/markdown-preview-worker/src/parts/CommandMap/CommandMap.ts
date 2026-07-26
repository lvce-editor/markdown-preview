import * as Render from '../Render/Render.ts'
import * as Create2 from '../Create2/Create2.ts'

export const commandMap = {
  'WebView.create': Create2.create2,
  'MarkdownPreview.render': Render.render,
}
