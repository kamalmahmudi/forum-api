const {
  AuthenticationsTableTestHelper,
  CommentsTableTestHelper,
  ThreadsTableTestHelper,
  TokenTestHelper,
  UsersTableTestHelper
} = require('../../../../tests/helpers')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
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
        url: '/threads/thread-1234/comments',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedComment).toBeDefined()
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
        url: '/threads/thread-1234/comments',
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
        url: '/threads/thread-1234/comments',
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
        url: '/threads/thread-1234/comments',
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

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-1234/comments',
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
        'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak lengkap'
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

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-1234/comments',
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
        'tidak dapat membuat komentar baru karena tipe data tidak sesuai'
      )
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and remove comment from persisting storage', async () => {
      // Arrange
      const server = await createServer(container)
      const { token, owner } = await TokenTestHelper.getValidToken(server)
      await ThreadsTableTestHelper.addThread({ owner })
      await CommentsTableTestHelper.addComment({ owner })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1234/comments/comment-1234',
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })

    it('should response 404 when thread or comment is not exist', async () => {
      // Arrange
      const server = await createServer(container)
      const { token, owner } = await TokenTestHelper.getValidToken(server)
      await ThreadsTableTestHelper.addThread({ owner })

      // Action & Assert
      let response, responseJson
      // Invalid commentId
      response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1234/comments/comment-1234',
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('komentar tidak dapat ditemukan')
      // Invalid threadId
      response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1111/comments/comment-1234',
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('komentar tidak dapat ditemukan')
    })

    it('should response 403 when the owner of the comment is not the same as token owner', async () => {
      // Arrange
      const server = await createServer(container)
      const { token, owner } = await TokenTestHelper.getValidToken(server)
      await ThreadsTableTestHelper.addThread({ owner })
      await UsersTableTestHelper.addUser({ username: 'otheruser' })
      await CommentsTableTestHelper.addComment({})

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1234/comments/comment-1234',
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'komentar hanya dapat dihapus atau diubah oleh pemilik komentar'
      )
    })

    it('should response 401 when request headers not contain authorization token', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1234/comments/comment-1234'
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
        url: '/threads/thread-1234/comments/comment-1234',
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
