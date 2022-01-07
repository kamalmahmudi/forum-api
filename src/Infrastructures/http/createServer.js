const Hapi = require('@hapi/hapi')

const { AuthenticationTokenManager } = require('../../Applications/securities')
const {
  AuthenticationError,
  ClientError,
  DomainErrorTranslator
} = require('../../Commons/exceptions')
const {
  authentications,
  comments,
  replies,
  threads,
  users
} = require('../../Interfaces/http/api')

const createServer = async container => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT
  })

  const tokenManager = container.getInstance(AuthenticationTokenManager.name)
  server.auth.scheme('forumapi_scheme', () => ({
    authenticate: async (request, h) => {
      const req = request.raw.req
      if (!req.headers.authorization) {
        throw new AuthenticationError('Missing authentication')
      }
      const authorization = req.headers.authorization.substring(
        'Bearer '.length
      )
      await tokenManager.verifyAccessToken(authorization)
      const { id, username } = await tokenManager.decodePayload(authorization)
      return h.authenticated({ credentials: { user: { id, username } } })
    }
  }))
  server.auth.strategy('forumapi_token', 'forumapi_scheme')

  await server.register([
    {
      plugin: users,
      options: { container }
    },
    {
      plugin: authentications,
      options: { container }
    },
    {
      plugin: threads,
      options: { container }
    },
    {
      plugin: comments,
      options: { container }
    },
    {
      plugin: replies,
      options: { container }
    }
  ])

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request
    if (response instanceof Error) {
      // bila response tersebut error, tangani sesuai kebutuhan
      const translatedError = DomainErrorTranslator.translate(response)
      // penanganan client error secara internal.
      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message
        })
        newResponse.code(translatedError.statusCode)
        return newResponse
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!translatedError.isServer) {
        return h.continue
      }

      // penanganan server error sesuai kebutuhan
      // console.error(response)
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami'
      })
      newResponse.code(500)
      return newResponse
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue
  })

  return server
}

module.exports = createServer
