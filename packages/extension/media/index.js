const createElement = (vdom) => {
  if (vdom.type === 'text') {
    return document.createTextNode(vdom.value)
  }
  const element = document.createElement(vdom.tag)
  for (const [name, value] of Object.entries(vdom.attributes || {})) {
    if (value === false || value === undefined) {
      continue
    }
    if (name === 'className') {
      element.className = value === true ? '' : value
    } else if (name === 'checked' || name === 'disabled') {
      element[name] = true
      element.setAttribute(name, '')
    } else if (value !== true) {
      element.setAttribute(name, value)
    }
  }
  element.append(...(vdom.children || []).map(createElement))
  return element
}

const updateAttributes = (element, oldAttributes, newAttributes) => {
  for (const name of Object.keys(oldAttributes || {})) {
    if (!(name in (newAttributes || {}))) {
      if (name === 'className') {
        element.className = ''
      } else {
        element.removeAttribute(name)
      }
    }
  }
  for (const [name, value] of Object.entries(newAttributes || {})) {
    if (name === 'className') {
      element.className = value === true ? '' : value
    } else if (name === 'checked' || name === 'disabled') {
      element[name] = Boolean(value)
      if (value) {
        element.setAttribute(name, '')
      } else {
        element.removeAttribute(name)
      }
    } else if (value !== true) {
      element.setAttribute(name, value)
    }
  }
}

const patch = (parent, oldVdom, newVdom, oldElement) => {
  if (!oldVdom) {
    parent.append(createElement(newVdom))
    return
  }
  if (!newVdom) {
    oldElement.remove()
    return
  }
  if (oldVdom.type !== newVdom.type || (oldVdom.type === 'element' && oldVdom.tag !== newVdom.tag)) {
    oldElement.replaceWith(createElement(newVdom))
    return
  }
  if (newVdom.type === 'text') {
    if (oldVdom.value !== newVdom.value) {
      oldElement.nodeValue = newVdom.value
    }
    return
  }
  updateAttributes(oldElement, oldVdom.attributes, newVdom.attributes)
  const oldChildren = oldVdom.children || []
  const newChildren = newVdom.children || []
  const childElements = Array.from(oldElement.childNodes)
  const length = Math.max(oldChildren.length, newChildren.length)
  for (let i = 0; i < length; i++) {
    patch(oldElement, oldChildren[i], newChildren[i], childElements[i])
  }
}

let currentDom
let output

const setDom = (dom) => {
  const oldElement = output?.firstChild
  if (!oldElement) {
    output?.append(createElement(dom))
  } else {
    patch(output, currentDom, dom, oldElement)
  }
  currentDom = dom
}

const updateScroll = ({ scrollTop = 0, scrollHeight = 0, viewportHeight = 0 }) => {
  const maximumPreviewScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0)
  const maximumEditorScroll = Math.max(scrollHeight - viewportHeight, 0)
  const ratio = maximumEditorScroll > 0 ? Math.min(Math.max(scrollTop / maximumEditorScroll, 0), 1) : 0
  window.scrollTo({ top: maximumPreviewScroll * ratio, behavior: 'auto' })
}

const initialize = ({ dom, scroll }) => {
  const app = document.createElement('div')
  app.className = 'App'
  output = document.createElement('div')
  output.className = 'Output'
  app.append(output)
  document.body.append(app)
  setDom(dom)
  updateScroll(scroll || {})
}

const update = ({ dom, scroll }) => {
  setDom(dom)
  requestAnimationFrame(() => updateScroll(scroll || {}))
}

globalThis.lvceRpc({
  initialize,
  update,
  updateScroll,
})
