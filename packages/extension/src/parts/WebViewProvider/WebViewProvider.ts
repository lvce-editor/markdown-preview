import * as MediaPreviewWorker from '../MarkdownPreviewWorker/MarkdownPreviewWorker.ts'

const previewId = 1

export const webViewProvider = {
  id: 'builtin.markdown-preview',
  async create(webView, uri) {
    // @ts-ignore
    const content = await vscode.readFile(uri)
    console.log({ content })
    // TODO if can use remote uri, use remote uri, else read file
    // @ts-ignore
    const remoteUrl = await MediaPreviewWorker.invoke('MediaPreview.getUrl', uri)
    await webView.invoke('initialize', remoteUrl)
    // @ts-ignore
    webViewProvider.webView = webView
    await MediaPreviewWorker.invoke('MediaPreview.create', previewId)
  },
  async open(uri, webView) {},
  commands: {},
}
