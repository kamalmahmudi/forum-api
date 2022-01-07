const UsersHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'users',
  register: async (server, { container }) => {
    const handler = new UsersHandler(container)
    server.route(routes(handler))
  }
}
