const routes = require('./routes')
const AuthenticationsHandler = require('./handler')

module.exports = {
  name: 'authentications',
  register: async (server, { container }) => {
    const handler = new AuthenticationsHandler(container)
    server.route(routes(handler))
  }
}
