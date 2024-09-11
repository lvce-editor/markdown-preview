import * as MediaPreviewWorker from '../MarkdownPreviewWorker/MarkdownPreviewWorker.ts'

export const webViewProvider = {
  id: 'builtin.markdown-preview',
  async create(webView, uri) {
    // @ts-ignore
    const content = await vscode.readFile(uri)
    const html = await MediaPreviewWorker.invoke('MarkdownPreview.render', content)
    await webView.invoke('initialize', html)
    // @ts-ignore
    webViewProvider.webView = webView
  },
  async open(uri, webView) {},
  commands: {},
}
