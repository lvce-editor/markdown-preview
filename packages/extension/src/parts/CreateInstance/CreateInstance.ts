import { executeCommand, readFile, type ViewContext } from '@lvce-editor/api'
import { render, toVirtualDom } from '../Render/Render.ts'

interface TextDocument {
  readonly uri: string
  readonly text: string
}

export const createInstance = async (context?: ViewContext) => {
  const uri = (context as (ViewContext & { readonly uri?: string }) | undefined)?.uri
  if (!uri || !context) {
    throw new Error('Markdown preview requires a document URI')
  }
  const getDocument = async (): Promise<TextDocument | undefined> => {
    return (await executeCommand('GetActiveEditor.getTextDocument')) as TextDocument | undefined
  }
  const document = await getDocument()
  let content = document?.uri === uri ? document.text : await readFile(uri)
  let dom = toVirtualDom((await render(content)).dom)
  let disposed = false
  let updating = false
  const update = async (): Promise<void> => {
    if (disposed || updating) {
      return
    }
    updating = true
    try {
      const document = await getDocument()
      if (disposed || document?.uri !== uri || document.text === content) {
        return
      }
      const nextDom = toVirtualDom((await render(document.text)).dom)
      if (disposed) {
        return
      }
      content = document.text
      dom = nextDom
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
