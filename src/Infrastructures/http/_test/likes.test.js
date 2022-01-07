const {
  AuthenticationsTableTestHelper,
  CommentsTableTestHelper,
  LikesTableTestHelper,
  ThreadsTableTestHelper,
  TokenTestHelper,
  UsersTableTestHelper
} = require('../../../../tests/helpers')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await LikesTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and persisted the new like', async () => {
      // Arrange
      const server = await createServer(container)
      const { token, owner } = await TokenTestHelper.getValidToken(server)
      await ThreadsTableTestHelper.addThread({ owner })
      await CommentsTableTestHelper.addComment({ owner })

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-1234/comments/comment-1234/likes',
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })

    it('should response 200 and remove the old like', async () => {
      // Arrange
      const server = await createServer(container)
      const { token, owner } = await TokenTestHelper.getValidToken(server)
      await ThreadsTableTestHelper.addThread({ owner })
      await CommentsTableTestHelper.addComment({ owner })
      await LikesTableTestHelper.addLike({ owner })

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-1234/comments/comment-1234/likes',
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })

    it('should response 404 when thread is not exist', async () => {
      // Arrange
      const server = await createServer(container)
      const { token } = await TokenTestHelper.getValidToken(server)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-1234/comments/comment-1234/likes',
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 404 when comment is not exist', async () => {
      // Arrange
      const server = await createServer(container)
      const { token, owner } = await TokenTestHelper.getValidToken(server)
      await ThreadsTableTestHelper.addThread({ owner })

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-1234/comments/comment-1234/likes',
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 401 when request headers not contain authorization token', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-1234/comments/comment-1234/likes'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 400 when request headers not contain valid authorization token', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-1234/comments/comment-1234/likes',
        headers: {
          authorization: 'Bearer invalid_token'
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('access token tidak valid')
    })
  })
})
