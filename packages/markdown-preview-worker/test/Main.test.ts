import { expect, test } from '@jest/globals'
import * as CommandMap from '../src/parts/CommandMap/CommandMap.js'

test('command map', () => {
  expect(CommandMap.commandMap).toBeDefined()
})
