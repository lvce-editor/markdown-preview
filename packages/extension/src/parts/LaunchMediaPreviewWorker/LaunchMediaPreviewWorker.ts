import * as MediaPreviewWorkerUrl from '../MarkdownPreviewWorkerUrl/MarkdownPreviewWorkerUrl.ts'

const execute = (method, ...params) => {
  return {}
}

export const launchMediaPreviewWorker = async () => {
  // @ts-ignore
  const rpc = await vscode.createRpc({
    url: MediaPreviewWorkerUrl.markdownPreviewWorkerUrl,
    name: 'Markdown Preview Worker',
    execute,
  })
  return rpc
}
