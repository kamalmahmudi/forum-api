const {
  CommentsTableTestHelper,
  LikesTableTestHelper,
  ThreadsTableTestHelper,
  UsersTableTestHelper
} = require('../../../../tests/helpers')
const { NewLike } = require('../../../Domains/likes/entities')
const pool = require('../../database/postgres/pool')
const { LikeRepositoryPostgres } = require('..')

describe('LikeRepositoryPostgres', () => {
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

    it('should persist new like', async () => {
      // Arrange
      const newLike = new NewLike({
        threadId: 'thread-1234',
        commentId: 'comment-1234',
        owner: 'user-1234'
      })
      const fakeIdGenerator = () => '1234' // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      const isAdded = await likeRepositoryPostgres.add(newLike)

      // Assert
      const likes = await LikesTableTestHelper.findLikesById('like-1234')
      expect(likes).toHaveLength(1)
      expect(isAdded).toEqual(true)
    })

    it('should throw NotFoundError if comment or owner is not exists on comments or users table', async () => {
      // Arrange
      const invalidTypeLike = {
        threadId: 'thread-1234'
      }
      const invalidCommentLike = new NewLike({
        threadId: 'thread-1234',
        commentId: 'comment-1111',
        owner: 'user-1234'
      })
      const invalidOwnerLike = new NewLike({
        threadId: 'thread-1234',
        commentId: 'comment-1234',
        owner: 'user-1111'
      })
      const fakeIdGenerator = () => '1234' // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action & Assert
      await expect(
        likeRepositoryPostgres.add(invalidTypeLike)
      ).rejects.toThrow()
      await expect(
        likeRepositoryPostgres.add(invalidCommentLike)
      ).rejects.toThrowError('LIKE_REPOSITORY.COMMENT_NOT_FOUND')
      await expect(
        likeRepositoryPostgres.add(invalidOwnerLike)
      ).rejects.toThrowError('LIKE_REPOSITORY.USER_NOT_FOUND')
    })
  })

  describe('deleteByCommentIdAndOwner function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
      await LikesTableTestHelper.addLike({
        id: 'like-1234',
        commentId: 'comment-1234',
        owner: 'user-1234'
      })
    })

    it('should remove the like from persistent storage', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool)

      // Action
      const isDeleted = await likeRepositoryPostgres.deleteByCommentIdAndOwner(
        'comment-1234',
        'user-1234'
      )
      const deletedLikes = await LikesTableTestHelper.findLikesById('like-1234')

      // Assert
      expect(isDeleted).toEqual(true)
      expect(deletedLikes.length).toEqual(0)
    })

    it('should throw NotFoundError when the like is not exist', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool)

      // Action & Assert
      await expect(
        likeRepositoryPostgres.deleteByCommentIdAndOwner(
          'comment-1111',
          'user-1234'
        )
      ).rejects.toThrowError('LIKE_REPOSITORY.NOT_FOUND')
      await expect(
        likeRepositoryPostgres.deleteByCommentIdAndOwner(
          'comment-1234',
          'user-1111'
        )
      ).rejects.toThrowError('LIKE_REPOSITORY.NOT_FOUND')
    })
  })
})
