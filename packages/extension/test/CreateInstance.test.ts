import { afterEach, expect, jest, test } from '@jest/globals'

import { createInstance } from '../src/parts/CreateInstance/CreateInstance.ts'

const getDocument = jest.fn<() => Promise<{ uri: string; text: string } | undefined>>()
const readFile = jest.fn<(uri: string) => Promise<string>>()
const dependencies = { getDocument, readFile }

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
  getDocument.mockResolvedValue(undefined)
  readFile.mockImplementation(async (uri) => `# ${uri}`)
  const firstContext = context('first.md')
  const first = await createInstance(firstContext, dependencies)
  const second = await createInstance(context('second.md'), dependencies)
  expect(first.render()).toEqual(expect.arrayContaining([expect.objectContaining({ text: 'first.md' })]))
  expect(second.render()).toEqual(expect.arrayContaining([expect.objectContaining({ text: 'second.md' })]))
  getDocument.mockResolvedValue({ uri: 'first.md', text: '# Unsaved changes' })
  await jest.advanceTimersByTimeAsync(150)
  expect(first.render()).toEqual(expect.arrayContaining([expect.objectContaining({ text: 'Unsaved changes' })]))
  expect(second.render()).toEqual(expect.arrayContaining([expect.objectContaining({ text: 'second.md' })]))
  expect(firstContext.requestRerender).toHaveBeenCalledTimes(1)
  const { promise, resolve } = Promise.withResolvers<{ uri: string; text: string }>()
  getDocument.mockReturnValue(promise)
  second.dispose()
  await jest.advanceTimersByTimeAsync(150)
  first.dispose()
  resolve({ uri: 'first.md', text: '# Too late' })
  await jest.advanceTimersByTimeAsync(150)
  expect(firstContext.requestRerender).toHaveBeenCalledTimes(1)
  expect(jest.getTimerCount()).toBe(0)
})

test('requires a context with a document URI', async () => {
  await expect(createInstance()).rejects.toThrow('Markdown preview requires a document URI')
  await expect(createInstance(context(''))).rejects.toThrow('Markdown preview requires a document URI')
})

test('uses the active document when its URI matches and ignores unchanged or unrelated updates', async () => {
  jest.useFakeTimers()
  getDocument.mockResolvedValue({ uri: 'active.md', text: '# Active document' })
  const instance = await createInstance(context('active.md'), dependencies)
  expect(readFile).not.toHaveBeenCalled()
  expect(instance.render()).toEqual(expect.arrayContaining([expect.objectContaining({ text: 'Active document' })]))
  getDocument.mockResolvedValue({ uri: 'other.md', text: '# Other document' })
  await jest.advanceTimersByTimeAsync(150)
  expect(instance.render()).toEqual(expect.arrayContaining([expect.objectContaining({ text: 'Active document' })]))
  getDocument.mockResolvedValue({ uri: 'active.md', text: '# Active document' })
  await jest.advanceTimersByTimeAsync(150)
  expect(instance.render()).toEqual(expect.arrayContaining([expect.objectContaining({ text: 'Active document' })]))
  instance.dispose()
  expect(jest.getTimerCount()).toBe(0)
})

test('clears its update lock after dependency errors', async () => {
  jest.useFakeTimers()
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  readFile.mockResolvedValue('# Initial content')
  getDocument
    .mockResolvedValueOnce(undefined)
    .mockRejectedValueOnce(new Error('temporary failure'))
    .mockResolvedValue({ uri: 'retry.md', text: '# Retry succeeded' })
  const instance = await createInstance(context('retry.md'), dependencies)
  await jest.advanceTimersByTimeAsync(150)
  await jest.advanceTimersByTimeAsync(150)
  expect(instance.render()).toEqual(expect.arrayContaining([expect.objectContaining({ text: 'Retry succeeded' })]))
  instance.dispose()
  errorSpy.mockRestore()
})
