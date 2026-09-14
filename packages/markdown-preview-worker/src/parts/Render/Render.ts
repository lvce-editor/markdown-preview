import { parse } from 'marked'

type Attributes = Record<string, string | boolean>

interface VirtualDomTextNode {
  readonly type: 'text'
  readonly value: string
}

interface VirtualDomElementNode {
  readonly type: 'element'
  readonly tag: string
  readonly attributes: Attributes
  readonly children: readonly VirtualDomNode[]
}

type VirtualDomNode = VirtualDomTextNode | VirtualDomElementNode

export interface RenderResult {
  readonly dom: VirtualDomElementNode
  readonly sourceLineCount: number
}

const allowedTags = new Set([
  'a',
  'blockquote',
  'br',
  'code',
  'del',
  'div',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'img',
  'input',
  'li',
  'ol',
  'p',
  'pre',
  'section',
  'strong',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  'ul',
])

const allowedAttributes = new Set(['alt', 'checked', 'class', 'disabled', 'href', 'rel', 'src', 'target', 'title', 'type'])
const voidTags = new Set(['br', 'hr', 'img', 'input'])

const decodeHtml = (value: string): string => {
  const named: Record<string, string> = { amp: '&', apos: "'", gt: '>', lt: '<', nbsp: '\u00a0', quot: '"' }
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z\d]+);/gi, (match, entity: string) => {
    const lowerEntity = entity.toLowerCase()
    if (lowerEntity.startsWith('#x')) {
      const codePoint = Number.parseInt(entity.slice(2), 16)
      return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match
    }
    if (lowerEntity.startsWith('#')) {
      const codePoint = Number.parseInt(entity.slice(1), 10)
      return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match
    }
    return named[entity.toLowerCase()] || match
  })
}

const isSafeUrl = (value: string, image: boolean): boolean => {
  const normalized = decodeHtml(value).trim()
  const protocol = normalized.replace(/[\u0000-\u0020\u007f]/g, '').toLowerCase()
  if (!normalized || /^(javascript|data|vbscript):/.test(protocol)) {
    return false
  }
  if (image) {
    return (
      normalized.startsWith('https:') || normalized.startsWith('/') || normalized.startsWith('./') || normalized.startsWith('../')
    )
  }
  return !/^[a-z][a-z\d+.-]*:/i.test(normalized) || /^(https?|mailto):/i.test(normalized)
}

const parseAttributes = (source: string): Attributes => {
  const attributes: Attributes = {}
  const attributePattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g
  let match = attributePattern.exec(source)
  while (match) {
    const [, name, doubleQuoted, singleQuoted, unquoted] = match
    const normalizedName = name.toLowerCase()
    const value = doubleQuoted ?? singleQuoted ?? unquoted ?? ''
    if (allowedAttributes.has(normalizedName)) {
      if (normalizedName === 'href' && isSafeUrl(value, false)) {
        attributes.href = decodeHtml(value)
      } else if (normalizedName === 'src' && isSafeUrl(value, true)) {
        attributes.src = decodeHtml(value)
      } else if (normalizedName !== 'href' && normalizedName !== 'src') {
        attributes[normalizedName === 'class' ? 'className' : normalizedName] = value || true
      }
    }
    match = attributePattern.exec(source)
  }
  return attributes
}

const getTagName = (source: string): string => {
  const match = /^<\/?\s*([a-z][a-z\d:-]*)\b/i.exec(source)
  return match ? match[1].toLowerCase() : ''
}

const appendText = (children: VirtualDomNode[], value: string): void => {
  if (!value) {
    return
  }
  const text = decodeHtml(value)
  const previous = children.at(-1)
  if (previous?.type === 'text') {
    children[children.length - 1] = { type: 'text', value: previous.value + text }
  } else {
    children.push({ type: 'text', value: text })
  }
}

const parseHtml = (html: string): VirtualDomNode[] => {
  const root: VirtualDomNode[] = []
  const stack: Array<{ tag: string; children: VirtualDomNode[] }> = [{ tag: '', children: root }]
  const tokenPattern = /<!--[\s\S]*?-->|<\/?[^>]+>|[^<]+/g
  let match = tokenPattern.exec(html)
  while (match) {
    const token = match[0]
    if (token.startsWith('<!--')) {
      match = tokenPattern.exec(html)
      continue
    }
    if (token.startsWith('</')) {
      const tag = getTagName(token)
      if (!tag) {
        appendText(stack.at(-1)?.children || root, token)
        match = tokenPattern.exec(html)
        continue
      }
      const index = stack.findLastIndex((item) => item.tag === tag)
      if (index > 0) {
        stack.length = index
      }
      match = tokenPattern.exec(html)
      continue
    }
    if (token.startsWith('<')) {
      const tag = getTagName(token)
      if (!tag) {
        appendText(stack.at(-1)?.children || root, token)
        match = tokenPattern.exec(html)
        continue
      }
      if (allowedTags.has(tag)) {
        const node: VirtualDomElementNode = {
          type: 'element',
          tag,
          attributes: parseAttributes(token.slice(tag.length + 1, -1)),
          children: [],
        }
        stack.at(-1)?.children.push(node)
        if (!voidTags.has(tag) && !token.endsWith('/>')) {
          stack.push({ tag, children: node.children as VirtualDomNode[] })
        }
      }
      match = tokenPattern.exec(html)
      continue
    }
    appendText(stack.at(-1)?.children || root, token)
    match = tokenPattern.exec(html)
  }
  return root
}

export const render = async (content: string): Promise<RenderResult> => {
  const html = await parse(content)
  const dom: VirtualDomElementNode = {
    type: 'element',
    tag: 'div',
    attributes: { className: 'Markdown', role: 'document' },
    children: parseHtml(html),
  }
  return { dom, sourceLineCount: content.split('\n').length }
}
