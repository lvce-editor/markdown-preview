import { executeCommand, readFile, type ViewContext } from '@lvce-editor/api'
import { render, toVirtualDom } from '../Render/Render.ts'

interface TextDocument {
  readonly uri: string
  readonly text: string
}

const getDocument = async (): Promise<TextDocument | undefined> => {
  return (await executeCommand('GetActiveEditor.getTextDocument')) as TextDocument | undefined
}

const defaultDependencies = { getDocument, readFile }

export const createInstance = async (context?: ViewContext & { readonly uri?: string }, dependencies = defaultDependencies) => {
  const uri = context?.uri
  if (!uri || !context) {
    throw new Error('Markdown preview requires a document URI')
  }
  const document = await dependencies.getDocument()
  let content = document?.uri === uri ? document.text : await dependencies.readFile(uri)
  const initialResult = await render(content)
  let dom = toVirtualDom(initialResult.dom)
  let disposed = false
  let updating = false
  const update = async (): Promise<void> => {
    if (disposed || updating) {
      return
    }
    updating = true
    try {
      const document = await dependencies.getDocument()
      if (disposed || document?.uri !== uri || document.text === content) {
        return
      }
      const result = await render(document.text)
      if (disposed) {
        return
      }
      content = document.text
      dom = toVirtualDom(result.dom)
      await context.requestRerender()
    } finally {
      updating = false
    }
  }
  const timer = setInterval(() => {
    void update().catch(console.error)
  }, 150)
  return {
    dispose: () => {
      disposed = true
      clearInterval(timer)
    },
    render: () => dom,
  }
}
