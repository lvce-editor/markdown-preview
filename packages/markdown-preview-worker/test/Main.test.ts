import { expect, test } from '@jest/globals'
import * as Main from '../src/parts/Main/Main.js'

test('main', () => {
  expect(Main.commandMap).toBeDefined()
})
