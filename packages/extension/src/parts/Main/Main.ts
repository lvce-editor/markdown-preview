import { activate as activateExtensionApi, registerView } from '@lvce-editor/api'
import { createInstance } from '../CreateInstance/CreateInstance.ts'

export const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerView({
    id: 'builtin.markdown-preview',
    title: 'Markdown Preview',
    kind: 'virtualDom',
    preferredLocation: 'preview',
    create: createInstance,
  })
}
