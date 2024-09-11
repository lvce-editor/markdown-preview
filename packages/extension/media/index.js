// TODO use virtual dom in worker

const initialize = (content) => {
  const app = document.createElement('div')
  app.className = 'App'

  const output = document.createElement('div')
  output.className = 'Output'
  // TODO avoid using innerHTML, use virtual dom instead
  output.innerHTML = content

  app.append(output)

  document.body.append(app)
}

const update = (state) => {}

const rpc = globalThis.lvceRpc({
  initialize,
  update,
})
