import webserver from "rjweb-server"

const routes = new webserver.routeList()
routes.routeBlock('/')
  .static('static', {
    addTypes: true,
    hideHTML: true
  })

routes.event('notfound', async(ctr) => {
  return ctr.status(404).print('404 Not Found')
}); routes.event('request', async(ctr) => {
  console.log(`${ctr.url.method} Request made to ${ctr.url.pathname}`)
})

const controller = webserver.initialize({
  port: 8000,
  body: {
    enabled: false
  }, compression: 'gzip',
  proxy: true
})

controller.setRoutes(routes)
controller.start().then((res) => {
  console.log(`webserver started on port ${res.port}`)
})