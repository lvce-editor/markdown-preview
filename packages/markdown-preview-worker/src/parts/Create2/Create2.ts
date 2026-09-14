import * as Render from '../Render/Render.ts'
import * as Rpc from '../Rpc/Rpc.ts'

const getTextDocument = async (uri: string) => {
  try {
    return await Rpc.invoke('WebView.getTextDocument', uri)
  } catch {
    // Older editors only expose WebView.readFile. Keep the preview usable there.
    const text = await Rpc.invoke('WebView.readFile', uri)
    return { text, uri, scrollTop: 0, scrollHeight: 0, viewportHeight: 0 }
  }
}

export const create2 = async ({ port, uri }) => {
  let textDocument = await getTextDocument(uri)
  if (!textDocument) {
    const text = await Rpc.invoke('WebView.readFile', uri)
    textDocument = { text, uri, scrollTop: 0, scrollHeight: 0, viewportHeight: 0 }
  }
  let content = textDocument.text
  let renderVersion = 0
  let updatePromise
  const rendered = await Render.render(content)
  await port.invoke('initialize', { ...rendered, uri, scroll: textDocument })

  const update = async () => {
    if (updatePromise) {
      return updatePromise
    }
    updatePromise = (async () => {
    try {
      const nextTextDocument = await getTextDocument(uri)
      if (!nextTextDocument) {
        return
      }
      textDocument = nextTextDocument
      if (textDocument.text !== content) {
        content = textDocument.text
        const version = ++renderVersion
        const next = await Render.render(content)
        if (version === renderVersion) {
          await port.invoke('update', { ...next, uri, scroll: textDocument })
        }
      } else {
        await port.invoke('updateScroll', textDocument)
      }
    } catch {
      clearInterval(timer)
    }
    })().finally(() => {
      updatePromise = undefined
    })
    return updatePromise
  }
  const timer = setInterval(update, 150)
  return {
    dispose: () => {
      clearInterval(timer)
    },
  }
}
