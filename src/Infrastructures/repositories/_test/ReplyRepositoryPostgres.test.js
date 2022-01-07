const {
  CommentsTableTestHelper,
  RepliesTableTestHelper,
  ThreadsTableTestHelper,
  UsersTableTestHelper
} = require('../../../../tests/helpers')
const {
  AddedReply,
  DetailedReply,
  NewReply
} = require('../../../Domains/replies/entities')
const pool = require('../../database/postgres/pool')
const { ReplyRepositoryPostgres } = require('..')

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('add function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
    })

    it('should persist new reply', async () => {
      // Arrange
      const newReply = new NewReply({
        content: 'content',
        threadId: 'thread-1234',
        commentId: 'comment-1234',
        owner: 'user-1234'
      })
      const fakeIdGenerator = () => '1234' // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      await replyRepositoryPostgres.add(newReply)

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-1234')
      expect(replies).toHaveLength(1)
    })

    it('should return added reply correctly', async () => {
      // Arrange
      const newReply = new NewReply({
        content: 'content',
        threadId: 'thread-1234',
        commentId: 'comment-1234',
        owner: 'user-1234'
      })
      const fakeIdGenerator = () => '1234' // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      const addedReply = await replyRepositoryPostgres.add(newReply)

      // Assert
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: 'reply-1234',
          content: 'content',
          owner: 'user-1234'
        })
      )
    })

    it('should throw NotFoundError if comment or owner is not exists on comments or users table', async () => {
      // Arrange
      const invalidTypeReply = {
        content: 'content'
      }
      const invalidCommentReply = new NewReply({
        content: 'content',
        threadId: 'thread-1234',
        commentId: 'comment-1111',
        owner: 'user-1234'
      })
      const invalidOwnerReply = new NewReply({
        content: 'content',
        threadId: 'thread-1234',
        commentId: 'comment-1234',
        owner: 'user-1111'
      })
      const fakeIdGenerator = () => '1234' // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action & Assert
      await expect(
        replyRepositoryPostgres.add(invalidTypeReply)
      ).rejects.toThrow()
      await expect(
        replyRepositoryPostgres.add(invalidCommentReply)
      ).rejects.toThrowError('REPLY_REPOSITORY.COMMENT_NOT_FOUND')
      await expect(
        replyRepositoryPostgres.add(invalidOwnerReply)
      ).rejects.toThrowError('REPLY_REPOSITORY.USER_NOT_FOUND')
    })
  })

  describe('find function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
      await RepliesTableTestHelper.addReply({})
    })

    it('should return existing reply', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool)

      // Action
      const reply = await replyRepositoryPostgres.find('reply-1234')

      // Assert
      expect(reply.id).toEqual('reply-1234')
      expect(reply.content).toEqual('content')
      expect(reply.comment_id).toEqual('comment-1234')
      expect(reply.owner).toEqual('user-1234')
    })

    it('should throw NotFoundError when the reply is not exist', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool)

      // Action & Assert
      await expect(
        replyRepositoryPostgres.find('reply-1111')
      ).rejects.toThrowError('REPLY_REPOSITORY.NOT_FOUND')
    })
  })

  describe('findByIdAndCommentId function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
      await RepliesTableTestHelper.addReply({})
    })

    it('should return existing reply', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool)

      // Action
      const reply = await replyRepositoryPostgres.findByIdAndCommentId(
        'reply-1234',
        'comment-1234'
      )

      // Assert
      expect(reply.id).toEqual('reply-1234')
      expect(reply.content).toEqual('content')
      expect(reply.comment_id).toEqual('comment-1234')
      expect(reply.owner).toEqual('user-1234')
    })

    it('should throw NotFoundError when the reply is not exist', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool)

      // Action & Assert
      await expect(
        replyRepositoryPostgres.findByIdAndCommentId(
          'reply-1234',
          'comment-1111'
        )
      ).rejects.toThrowError('REPLY_REPOSITORY.NOT_FOUND')
      await expect(
        replyRepositoryPostgres.findByIdAndCommentId(
          'reply-1111',
          'comment-1234'
        )
      ).rejects.toThrowError('REPLY_REPOSITORY.NOT_FOUND')
      await expect(
        replyRepositoryPostgres.findByIdAndCommentId(
          'reply-1111',
          'comment-1111'
        )
      ).rejects.toThrowError('REPLY_REPOSITORY.NOT_FOUND')
    })
  })

  describe('findAllByCommentId function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
    })

    it('should return existing replies', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'reply-1234' })
      await RepliesTableTestHelper.addReply({ id: 'reply-1235' })
      await RepliesTableTestHelper.addReply({ id: 'reply-1236' })
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool)

      // Action
      const replies = await replyRepositoryPostgres.findAllByCommentId(
        'comment-1234'
      )

      // Assert
      await expect(replies).toHaveLength(3)
      expect(replies[0]).toBeInstanceOf(DetailedReply)
      expect(replies[0].id).toEqual('reply-1234')
      expect(replies[0].content).toEqual('content')
      expect(replies[0].date).toBeDefined()
      expect(replies[0].username).toEqual('username')
      expect(replies[1].id).toEqual('reply-1235')
      expect(replies[2].id).toEqual('reply-1236')
    })

    it('should return undefined when no reply found in the comment', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool)

      // Action
      const replies = await replyRepositoryPostgres.findAllByCommentId(
        'comment-1234'
      )

      // Assert
      await expect(replies).toBeUndefined()
    })
  })

  describe('findAllByCommentIds function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({ id: 'comment-1234' })
    })

    it('should return existing replies in groups', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-1235' })
      await RepliesTableTestHelper.addReply({ id: 'reply-1234' })
      await RepliesTableTestHelper.addReply({ id: 'reply-1235' })
      await RepliesTableTestHelper.addReply({ id: 'reply-1236' })
      await RepliesTableTestHelper.addReply({
        id: 'reply-1237',
        commentId: 'comment-1235'
      })
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool)

      // Action
      const replies = await replyRepositoryPostgres.findAllByCommentIds([
        'comment-1234',
        'comment-1235'
      ])

      // Assert
      await expect(Object.keys(replies)).toHaveLength(2)
      expect(replies['comment-1234']).toHaveLength(3)
      expect(replies['comment-1234'][0]).toBeInstanceOf(DetailedReply)
      expect(replies['comment-1234'][0].id).toEqual('reply-1234')
      expect(replies['comment-1234'][0].content).toEqual('content')
      expect(replies['comment-1234'][0].date).toBeDefined()
      expect(replies['comment-1234'][0].username).toEqual('username')
      expect(replies['comment-1234'][1].id).toEqual('reply-1235')
      expect(replies['comment-1234'][2].id).toEqual('reply-1236')
      expect(replies['comment-1235']).toHaveLength(1)
      expect(replies['comment-1235'][0].id).toEqual('reply-1237')
    })

    it('should return empty object when no reply found in the comment', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool)

      // Action
      const replies = await replyRepositoryPostgres.findAllByCommentIds([
        'comment-1234'
      ])

      // Assert
      await expect(replies).toEqual({})
    })
  })

  describe('verifyOwnership function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
      await RepliesTableTestHelper.addReply({})
    })

    it('should not throw error on valid reply owner', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool)
      const reply = await replyRepositoryPostgres.find('reply-1234')

      // Action
      const isOwner = await replyRepositoryPostgres.verifyOwnership(
        reply,
        'user-1234'
      )

      // Assert
      await expect(isOwner).toEqual(true)
    })

    it('should throw error on invalid reply owner', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool)
      const reply = await replyRepositoryPostgres.find('reply-1234')

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyOwnership(reply, 'user-1111')
      ).rejects.toThrowError('REPLY_REPOSITORY.NOT_THE_OWNER')
    })
  })

  describe('delete function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
      await RepliesTableTestHelper.addReply({})
    })

    it('should remove the reply from persistent storage', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool)

      // Action
      const isDeleted = await replyRepositoryPostgres.delete('reply-1234')
      const deletedReplies = await RepliesTableTestHelper.findRepliesById(
        'reply-1234'
      )

      // Assert
      expect(isDeleted).toEqual(true)
      expect(deletedReplies.length).toEqual(1)
      expect(deletedReplies[0].is_deleted).toEqual(true)
      await expect(
        replyRepositoryPostgres.find('reply-1234')
      ).rejects.toThrowError('REPLY_REPOSITORY.NOT_FOUND')
    })

    it('should throw NotFoundError when the reply is not exist', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool)

      // Action & Assert
      await expect(
        replyRepositoryPostgres.delete('reply-1111')
      ).rejects.toThrowError('REPLY_REPOSITORY.NOT_FOUND')
    })
  })
})
