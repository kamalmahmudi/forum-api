const {
  CommentsTableTestHelper,
  LikesTableTestHelper,
  ThreadsTableTestHelper,
  UsersTableTestHelper
} = require('../../../../tests/helpers')
const {
  AddedComment,
  DetailedComment,
  NewComment
} = require('../../../Domains/comments/entities')
const pool = require('../../database/postgres/pool')
const { CommentRepositoryPostgres } = require('..')

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable()
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
    })

    it('should persist new comment', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'content',
        threadId: 'thread-1234',
        owner: 'user-1234'
      })
      const fakeIdGenerator = () => '1234' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      await commentRepositoryPostgres.add(newComment)

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        'comment-1234'
      )
      expect(comments).toHaveLength(1)
    })

    it('should return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'content',
        threadId: 'thread-1234',
        owner: 'user-1234'
      })
      const fakeIdGenerator = () => '1234' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      const addedComment = await commentRepositoryPostgres.add(newComment)

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-1234',
          content: 'content',
          owner: 'user-1234'
        })
      )
    })

    it('should throw NotFoundError if thread or owner is not exists on threads or users table', async () => {
      // Arrange
      const invalidTypeComment = {
        content: 'content'
      }
      const invalidThreadComment = new NewComment({
        content: 'content',
        threadId: 'thread-1111',
        owner: 'user-1234'
      })
      const invalidOwnerComment = new NewComment({
        content: 'content',
        threadId: 'thread-1234',
        owner: 'user-1111'
      })
      const fakeIdGenerator = () => '1234' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action & Assert
      await expect(
        commentRepositoryPostgres.add(invalidTypeComment)
      ).rejects.toThrow()
      await expect(
        commentRepositoryPostgres.add(invalidThreadComment)
      ).rejects.toThrowError('COMMENT_REPOSITORY.THREAD_NOT_FOUND')
      await expect(
        commentRepositoryPostgres.add(invalidOwnerComment)
      ).rejects.toThrowError('COMMENT_REPOSITORY.USER_NOT_FOUND')
    })
  })

  describe('find function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
    })

    it('should return existing comment', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool)

      // Action
      const comment = await commentRepositoryPostgres.find('comment-1234')

      // Assert
      expect(comment.id).toEqual('comment-1234')
      expect(comment.content).toEqual('content')
      expect(comment.thread_id).toEqual('thread-1234')
      expect(comment.owner).toEqual('user-1234')
    })

    it('should throw NotFoundError when the comment is not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool)

      // Action & Assert
      await expect(
        commentRepositoryPostgres.find('comment-1111')
      ).rejects.toThrowError('COMMENT_REPOSITORY.NOT_FOUND')
    })
  })

  describe('findByIdAndThreadId function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
    })

    it('should return existing comment', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool)

      // Action
      const comment = await commentRepositoryPostgres.findByIdAndThreadId('comment-1234', 'thread-1234')

      // Assert
      expect(comment.id).toEqual('comment-1234')
      expect(comment.content).toEqual('content')
      expect(comment.thread_id).toEqual('thread-1234')
      expect(comment.owner).toEqual('user-1234')
    })

    it('should throw NotFoundError when the comment is not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool)

      // Action & Assert
      await expect(
        commentRepositoryPostgres.findByIdAndThreadId('comment-1234', 'thread-1111')
      ).rejects.toThrowError('COMMENT_REPOSITORY.NOT_FOUND')
      await expect(
        commentRepositoryPostgres.findByIdAndThreadId('comment-1111', 'thread-1234')
      ).rejects.toThrowError('COMMENT_REPOSITORY.NOT_FOUND')
      await expect(
        commentRepositoryPostgres.findByIdAndThreadId('comment-1111', 'thread-1111')
      ).rejects.toThrowError('COMMENT_REPOSITORY.NOT_FOUND')
    })
  })

  describe('findAllByThreadId function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.addThread({})
    })

    it('should return existing comments', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-1234' })
      await LikesTableTestHelper.addLike({ id: 'like-1234', commentId: 'comment-1234', owner: 'user-1234' })
      await CommentsTableTestHelper.addComment({ id: 'comment-1235' })
      await CommentsTableTestHelper.addComment({ id: 'comment-1236' })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool)

      // Action
      const comments = await commentRepositoryPostgres.findAllByThreadId('thread-1234')

      // Assert
      await expect(comments).toHaveLength(3)
      expect(comments[0]).toBeInstanceOf(DetailedComment)
      expect(comments[0].id).toEqual('comment-1234')
      expect(comments[0].content).toEqual('content')
      expect(comments[0].date).toBeDefined()
      expect(comments[0].username).toEqual('username')
      expect(comments[0].likeCount).toEqual(1)
      expect(comments[1].id).toEqual('comment-1235')
      expect(comments[1].likeCount).toEqual(0)
      expect(comments[2].id).toEqual('comment-1236')
      expect(comments[2].likeCount).toEqual(0)
    })

    it('should return undefined no comment found in the thread', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool)

      // Action
      const comments = await commentRepositoryPostgres.findAllByThreadId('thread-1234')

      // Assert
      await expect(comments).toBeUndefined()
    })
  })

  describe('verifyOwnership function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
    })

    it('should not throw error on valid comment owner', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool)
      const comment = await commentRepositoryPostgres.find('comment-1234')

      // Action
      const isOwner = await commentRepositoryPostgres.verifyOwnership(
        comment,
        'user-1234'
      )

      // Assert
      await expect(isOwner).toEqual(true)
    })

    it('should throw error on invalid comment owner', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool)
      const comment = await commentRepositoryPostgres.find('comment-1234')

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyOwnership(comment, 'user-1111')
      ).rejects.toThrowError('COMMENT_REPOSITORY.NOT_THE_OWNER')
    })
  })

  describe('delete function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
    })

    it('should remove the comment from persistent storage', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool)

      // Action
      const isDeleted = await commentRepositoryPostgres.delete('comment-1234')
      const deletedComments = await CommentsTableTestHelper.findCommentsById('comment-1234')

      // Assert
      expect(isDeleted).toEqual(true)
      expect(deletedComments.length).toEqual(1)
      expect(deletedComments[0].is_deleted).toEqual(true)
      await expect(
        commentRepositoryPostgres.find('comment-1234')
      ).rejects.toThrowError('COMMENT_REPOSITORY.NOT_FOUND')
    })

    it('should throw NotFoundError when the comment is not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool)

      // Action & Assert
      await expect(
        commentRepositoryPostgres.delete('comment-1111')
      ).rejects.toThrowError('COMMENT_REPOSITORY.NOT_FOUND')
    })
  })
})
