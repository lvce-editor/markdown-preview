import * as MediaPreviewWorker from '../MarkdownPreviewWorker/MarkdownPreviewWorker.ts'

const previewId = 1

export const webViewProvider = {
  id: 'builtin.markdown-preview',
  async create(webView, uri) {
    console.log({ uri })
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
