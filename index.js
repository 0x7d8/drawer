import webserver from "rjweb-server"

const routes = new webserver.routeList()
routes.static('/', 'static', {
  addTypes: true,
  remHTML: true
})

routes.event('notfound', async(ctr) => {
  return ctr.status(404).print('404 Not Found')
})

webserver.start({
  routes,
  port: 8000,
  body: {
    enabled: false
  }, compress: true,
  proxy: true
}).then((res) => {
  console.log(`webserver started on port ${res.port}`)
})