import { commandMap as defaultCommandMap, listen } from '@lvce-editor/extension-host-sub-worker/api'
import * as CommandMap from '../CommandMap/CommandMap.ts'

export const main = async (): Promise<void> => {
  await listen({
    ...defaultCommandMap,
    ...CommandMap.commandMap,
  })
}
