import { expect, test } from '@jest/globals'
import * as Render from '../src/parts/Render/Render.ts'

const flatten = (node: any): any[] => [node, ...(node.children || []).flatMap(flatten)]

test('renders common markdown as virtual dom', async () => {
  const result = await Render.render('# Hello\n\n- one\n- two\n\n| A | B |\n| - | - |\n| 1 | 2 |')
  const nodes = flatten(result.dom)
  expect(result.dom.type).toBe('element')
  expect(nodes.some((node) => node.tag === 'h1')).toBe(true)
  expect(nodes.some((node) => node.tag === 'ul')).toBe(true)
  expect(nodes.some((node) => node.tag === 'table')).toBe(true)
  expect(result.sourceLineCount).toBe(8)
})

test('does not expose executable markup or unsafe urls', async () => {
  const result = await Render.render('<script>alert(1)</script>\n\n[bad](javascript:alert(1))\n\n![bad](data:text/html,alert(1))')
  const nodes = flatten(result.dom)
  expect(nodes.some((node) => node.tag === 'script')).toBe(false)
  expect(nodes.some((node) => node.attributes?.href?.startsWith('javascript:'))).toBe(false)
  expect(nodes.some((node) => node.attributes?.src?.startsWith('data:'))).toBe(false)
})

test('decodes text without using html injection', async () => {
  const result = await Render.render('Fish &amp; chips')
  const nodes = flatten(result.dom)
  expect(nodes.some((node) => node.type === 'text' && node.value === 'Fish & chips')).toBe(true)
})

test('preserves angle brackets in plain text', async () => {
  const result = await Render.render('5 < 7 > 3')
  const nodes = flatten(result.dom)
  expect(nodes.some((node) => node.type === 'text' && node.value.includes('5 < 7 > 3'))).toBe(true)
})

test('rejects encoded and whitespace-obfuscated unsafe urls', async () => {
  const result = await Render.render('<a href="java&#x09;script:alert(1)">bad</a> <a href="java script:alert(1)">also bad</a>')
  const links = flatten(result.dom).filter((node) => node.tag === 'a')
  expect(links).toHaveLength(2)
  expect(links.every((node) => !node.attributes.href)).toBe(true)
})

test('does not throw on malformed numeric entities', async () => {
  await expect(Render.render('&#99999999;')).resolves.toBeDefined()
})
