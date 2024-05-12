import { Server } from "rjweb-server"

const server = new Server({
  port: 8000,
  body: {
    enabled: false
  }, compression: 'gzip',
  proxy: true
})

server.prefix('/')
  .static('static', {
    addTypes: true,
    hideHTML: true
  })

server.event('notfound', async(ctr) => {
  return ctr.status(404).print('404 Not Found')
}).event('request', async(ctr) => {
  console.log(`${ctr.url.method} Request made to ${ctr.url.pathname}`)
})

server.start().then((res) => {
  console.log(`webserver started on port ${res.port}`)
})