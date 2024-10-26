import * as MarkdownPreviewWorkerUrl from '../MarkdownPreviewWorkerUrl/MarkdownPreviewWorkerUrl.ts'

const execute = (method, ...params) => {
  return {}
}

export const launchMarkdownPreviewWorker = async () => {
  // @ts-ignore
  const rpc = await vscode.createRpc({
    url: MarkdownPreviewWorkerUrl.markdownPreviewWorkerUrl,
    name: 'Markdown Preview Worker',
    execute,
  })
  return rpc
}
