const {
  AuthenticationsTableTestHelper,
  CommentsTableTestHelper,
  RepliesTableTestHelper,
  ThreadsTableTestHelper,
  TokenTestHelper,
  UsersTableTestHelper
} = require('../../../../tests/helpers')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await RepliesTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'content'
      }
      const server = await createServer(container)
      const { token, owner } = await TokenTestHelper.getValidToken(server)
      await ThreadsTableTestHelper.addThread({ owner })
      await CommentsTableTestHelper.addComment({ owner })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-1234/comments/comment-1234/replies',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedReply).toBeDefined()
    })

    it('should response 404 when thread is not exist', async () => {
      // Arrange
      const requestPayload = {
        content: 'content'
      }
      const server = await createServer(container)
      const { token } = await TokenTestHelper.getValidToken(server)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-1234/comments/comment-1234/replies',
        payload: requestPayload,
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
      const requestPayload = {
        content: 'content'
      }
      const server = await createServer(container)
      const { token, owner } = await TokenTestHelper.getValidToken(server)
      await ThreadsTableTestHelper.addThread({ owner })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-1234/comments/comment-1234/replies',
        payload: requestPayload,
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
      const requestPayload = {
        content: 'content'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-1234/comments/comment-1234/replies',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 400 when request headers not contain valid authorization token', async () => {
      // Arrange
      const requestPayload = {
        content: 'content'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-1234/comments/comment-1234/replies',
        payload: requestPayload,
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

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {}
      const server = await createServer(container)
      const { token, owner } = await TokenTestHelper.getValidToken(server)
      await ThreadsTableTestHelper.addThread({ owner })
      await CommentsTableTestHelper.addComment({ owner })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-1234/comments/comment-1234/replies',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak lengkap'
      )
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: ['content']
      }
      const server = await createServer(container)
      const { token, owner } = await TokenTestHelper.getValidToken(server)
      await ThreadsTableTestHelper.addThread({ owner })
      await CommentsTableTestHelper.addComment({ owner })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-1234/comments/comment-1234/replies',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'tidak dapat membuat balasan baru karena tipe data tidak sesuai'
      )
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and remove reply from persisting storage', async () => {
      // Arrange
      const server = await createServer(container)
      const { token, owner } = await TokenTestHelper.getValidToken(server)
      await ThreadsTableTestHelper.addThread({ owner })
      await CommentsTableTestHelper.addComment({ owner })
      await RepliesTableTestHelper.addReply({ owner })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1234/comments/comment-1234/replies/reply-1234',
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })

    it('should response 404 when thread or comment or reply is not exist', async () => {
      // Arrange
      const server = await createServer(container)
      const { token, owner } = await TokenTestHelper.getValidToken(server)
      await ThreadsTableTestHelper.addThread({ owner })
      await CommentsTableTestHelper.addComment({ owner })

      // Action & Assert
      let response, responseJson
      // Invalid replyId
      response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1234/comments/comment-1234/replies/reply-1234',
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toBeDefined()
      // Invalid commentId
      response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1234/comments/comment-1111/replies/reply-1234',
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toBeDefined()
      // Invalid threadId
      response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1111/comments/comment-1234/replies/reply-1234',
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toBeDefined()
    })

    it('should response 403 when the owner of the reply is not the same as token owner', async () => {
      // Arrange
      const server = await createServer(container)
      const { token, owner } = await TokenTestHelper.getValidToken(server)
      await ThreadsTableTestHelper.addThread({ owner })
      await CommentsTableTestHelper.addComment({ owner })
      await UsersTableTestHelper.addUser({ username: 'otheruser' })
      await RepliesTableTestHelper.addReply({})

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1234/comments/comment-1234/replies/reply-1234',
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'balasan hanya dapat dihapus atau diubah oleh pemilik balasan'
      )
    })

    it('should response 401 when request headers not contain authorization token', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1234/comments/comment-1234/replies/reply-1234'
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
        method: 'DELETE',
        url: '/threads/thread-1234/comments/comment-1234/replies/reply-1234',
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
