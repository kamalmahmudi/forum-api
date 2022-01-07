const {
  AuthenticationsTableTestHelper,
  CommentsTableTestHelper,
  LikesTableTestHelper,
  RepliesTableTestHelper,
  ThreadsTableTestHelper,
  TokenTestHelper,
  UsersTableTestHelper
} = require('../../../../tests/helpers')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'title',
        body: 'body'
      }
      const server = await createServer(container)
      const { token } = await TokenTestHelper.getValidToken(server)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread).toBeDefined()
    })

    it('should response 401 when request headers not contain authorization token', async () => {
      // Arrange
      const requestPayload = {
        title: 'title',
        body: 'body'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
        title: 'title',
        body: 'body'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
      const requestPayload = {
        title: 'title'
      }
      const server = await createServer(container)
      const { token } = await TokenTestHelper.getValidToken(server)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak lengkap'
      )
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 1234,
        body: 'body'
      }
      const server = await createServer(container)
      const { token } = await TokenTestHelper.getValidToken(server)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
        'tidak dapat membuat thread baru karena tipe data tidak sesuai'
      )
    })
  })

  describe('when GET /threads/{threadId}', () => {
    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable()
    })

    it('should response 200 and return the thread correctly', async () => {
      // Arrange
      const server = await createServer(container)
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({
        id: 'comment-1234',
        content: 'satu'
      })
      await LikesTableTestHelper.addLike({
        id: 'like-1234',
        commentId: 'comment-1234',
        owner: 'user-1234'
      })
      await RepliesTableTestHelper.addReply({
        id: 'reply-1234',
        content: 'satu-satu'
      })
      await RepliesTableTestHelper.addReply({
        id: 'reply-1235',
        content: 'satu-dua',
        isDeleted: true
      })
      await CommentsTableTestHelper.addComment({
        id: 'comment-1235',
        content: 'dua',
        isDeleted: true
      })
      await CommentsTableTestHelper.addComment({
        id: 'comment-1236',
        content: 'tiga'
      })

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-1234'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread.id).toEqual('thread-1234')
      expect(responseJson.data.thread.comments).toHaveLength(3)
      expect(responseJson.data.thread.comments[0].content).toEqual('satu')
      expect(responseJson.data.thread.comments[0].likeCount).toEqual(1)
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(2)
      expect(responseJson.data.thread.comments[0].replies[0].content).toEqual(
        'satu-satu'
      )
      expect(responseJson.data.thread.comments[0].replies[1].content).toEqual(
        '**balasan telah dihapus**'
      )
      expect(responseJson.data.thread.comments[1].content).toEqual(
        '**komentar telah dihapus**'
      )
      expect(responseJson.data.thread.comments[1].likeCount).toEqual(0)
      expect(responseJson.data.thread.comments[1].replies).toBeUndefined()
      expect(responseJson.data.thread.comments[2].content).toEqual('tiga')
      expect(responseJson.data.thread.comments[1].likeCount).toEqual(0)
      expect(responseJson.data.thread.comments[2].replies).toBeUndefined()
    })

    it('should response 404 when thread is not exist ', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-1234'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak dapat ditemukan')
    })
  })
})
