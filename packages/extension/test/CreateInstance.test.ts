import { afterEach, expect, jest, test } from '@jest/globals'

const executeCommand = jest.fn<() => Promise<unknown>>()
const readFile = jest.fn<(uri: string) => Promise<string>>()
jest.unstable_mockModule('@lvce-editor/api', () => ({ executeCommand, readFile }))
const { createInstance } = await import('../src/parts/CreateInstance/CreateInstance.ts')

const context = (uri: string) => ({
  uri,
  uid: 1,
  viewId: 'builtin.markdown-preview',
  requestRerender: jest.fn<() => Promise<void>>(),
  showContextMenu: jest.fn<() => Promise<void>>(),
})

afterEach(() => {
  jest.useRealTimers()
  jest.resetAllMocks()
})

test('keeps instances independent and ignores in-flight updates after disposal', async () => {
  jest.useFakeTimers()
  executeCommand.mockResolvedValue(undefined)
  readFile.mockImplementation(async (uri) => `# ${uri}`)
  const firstContext = context('first.md')
  const first = await createInstance(firstContext)
  const second = await createInstance(context('second.md'))
  expect(first.render()).toEqual(expect.arrayContaining([expect.objectContaining({ text: 'first.md' })]))
  expect(second.render()).toEqual(expect.arrayContaining([expect.objectContaining({ text: 'second.md' })]))
  executeCommand.mockResolvedValue({ uri: 'first.md', text: '# Unsaved changes' })
  await jest.advanceTimersByTimeAsync(150)
  expect(first.render()).toEqual(expect.arrayContaining([expect.objectContaining({ text: 'Unsaved changes' })]))
  expect(second.render()).toEqual(expect.arrayContaining([expect.objectContaining({ text: 'second.md' })]))
  expect(firstContext.requestRerender).toHaveBeenCalledTimes(1)
  let resolve: (value: unknown) => void = () => {}
  executeCommand.mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done
      }),
  )
  second.dispose()
  await jest.advanceTimersByTimeAsync(150)
  first.dispose()
  resolve({ uri: 'first.md', text: '# Too late' })
  await jest.advanceTimersByTimeAsync(150)
  expect(firstContext.requestRerender).toHaveBeenCalledTimes(1)
  expect(jest.getTimerCount()).toBe(0)
})
