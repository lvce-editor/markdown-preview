import * as LoadMarked from '../LoadMarked/LoadMarked.ts'
import * as MarkedUrl from '../MarkedUrl/MarkedUrl.ts'

export const render = async (content) => {
  const marked = await LoadMarked.loadMarked(MarkedUrl.markedUrl)
  const html = marked.parse(content)
  return html
}
