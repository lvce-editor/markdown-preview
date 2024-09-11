// TODO use virtual dom in  worker

const initialize = () => {
  const app = document.createElement('div')
  app.className = 'App'

  const heading = document.createElement('h1')
  heading.textContent = 'hello from markdown preview'
  app.append(heading)

  document.body.append(app)
}

const update = (state) => {}

const rpc = globalThis.lvceRpc({
  initialize,
  update,
})
