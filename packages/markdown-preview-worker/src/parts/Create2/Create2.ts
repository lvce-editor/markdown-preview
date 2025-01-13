import * as Render from '../Render/Render.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const create2 = async ({ port, uri }) => {
  const content = await Rpc.invoke('WebView.readFile', uri)
  const html = await Render.render(content)
  await port.invoke('initialize', html)
  return {}
}
