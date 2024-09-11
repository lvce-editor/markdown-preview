// TODO use virtual dom in  worker

const initialize = (content) => {
  const app = document.createElement('div')
  app.className = 'App'

  const pre = document.createElement('pre')
  pre.textContent = content
  app.append(pre)

  document.body.append(app)
}

const update = (state) => {}

const rpc = globalThis.lvceRpc({
  initialize,
  update,
})
