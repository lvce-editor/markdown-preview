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

test('strips application classes and active elements before entering the editor DOM', async () => {
  const result = await Render.render(
    '<div class="Viewlet Editor" style="position:fixed" onclick="bad()"><input type="image" src="https://example.com/x"><iframe srcdoc="bad"></iframe></div>',
  )
  const nodes = Render.toVirtualDom(result.dom)
  expect(nodes.every((node) => typeof node.type === 'number')).toBe(true)
  expect(nodes.some((node) => node.className === 'Viewlet Editor' || node.style || node.onclick || node.srcdoc)).toBe(false)
  expect(nodes.some((node) => node.disabled === true)).toBe(true)
})

test('parses entities, safe links, images, and ordinary attributes', async () => {
  const result = await Render.render(
    '<p title="title" checked class="ignored">&#65; &#x42; &#99999999; &amp; &unknown;</p><a href="mailto:test@example.com">mail</a><a href="ftp://example.com">bad</a><img src="https://example.com/a"><img src="/a"><img src="./a"><img src="../a"><img src="relative.png">',
  )
  const nodes = flatten(result.dom)
  expect(nodes.some((node) => node.type === 'text' && node.value.includes('A B &#99999999; & &unknown;'))).toBe(true)
  expect(nodes.some((node) => node.tag === 'p' && node.attributes.title === 'title' && node.attributes.checked === true)).toBe(
    true,
  )
  expect(nodes.some((node) => node.tag === 'a' && node.attributes.href === 'mailto:test@example.com')).toBe(true)
  expect(nodes.some((node) => node.tag === 'a' && !node.attributes.href)).toBe(true)
  expect(nodes.filter((node) => node.tag === 'img' && node.attributes.src).map((node) => node.attributes.src)).toEqual([
    'https://example.com/a',
    '/a',
    './a',
    '../a',
  ])
})

test('handles malformed tags, comments, ignored elements, and self-closing elements', async () => {
  const result = await Render.render(
    '<!-- hidden --><div>before < 3 <b/> after</div><unknown>hidden</unknown><br/><p>tail</p></></oops>',
  )
  const nodes = flatten(result.dom)
  expect(nodes.some((node) => node.type === 'text' && node.value.includes('before'))).toBe(true)
  expect(nodes.some((node) => node.tag === 'unknown')).toBe(false)
  expect(nodes.some((node) => node.type === 'text' && node.value.includes('hidden'))).toBe(true)
  expect(nodes.some((node) => node.tag === 'br')).toBe(true)
})

test('preserves relative links and rejects empty or unsupported protocols', async () => {
  const result = await Render.render('<a href="/page">root</a><a href="">empty</a><a href="custom:thing">custom</a>')
  const links = flatten(result.dom).filter((node) => node.tag === 'a')
  expect(links[0].attributes).toMatchObject({ href: '/page', target: '_blank', rel: 'noopener noreferrer' })
  expect(links.slice(1).every((node) => !node.attributes.href)).toBe(true)
})
