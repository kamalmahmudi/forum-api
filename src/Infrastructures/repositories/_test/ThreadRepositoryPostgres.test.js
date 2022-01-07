const {
  CommentsTableTestHelper,
  RepliesTableTestHelper,
  ThreadsTableTestHelper,
  UsersTableTestHelper
} = require('../../../../tests/helpers')
const {
  AddedThread,
  DetailedThread,
  NewThread
} = require('../../../Domains/threads/entities')
const pool = require('../../database/postgres/pool')
const { ThreadRepositoryPostgres } = require('..')

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({})
  })

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await RepliesTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('add function', () => {
    it('should persist new thread', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'title',
        body: 'body',
        owner: 'user-1234'
      })
      const fakeIdGenerator = () => '1234' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      await threadRepositoryPostgres.add(newThread)

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById(
        'thread-1234'
      )
      expect(threads).toHaveLength(1)
    })

    it('should return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'title',
        body: 'body',
        owner: 'user-1234'
      })
      const fakeIdGenerator = () => '1234' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      const addedThread = await threadRepositoryPostgres.add(newThread)

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-1234',
          title: 'title',
          body: 'body',
          owner: 'user-1234'
        })
      )
    })
  })

  describe('find function', () => {
    it('should return existing thread correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({})
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool)

      // Action
      const thread = await threadRepositoryPostgres.find('thread-1234')
      expect(thread).toBeInstanceOf(DetailedThread)
      expect(thread.id).toEqual('thread-1234')
      expect(thread.title).toEqual('title')
      expect(thread.body).toEqual('body')
      expect(thread.date).toBeDefined()
      expect(thread.username).toEqual('username')
    })

    it('should throw NotFoundError when the thread is not exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool)

      // Action & Assert
      await expect(
        threadRepositoryPostgres.find('comment-1234')
      ).rejects.toThrowError('THREAD_REPOSITORY.NOT_FOUND')
    })
  })
})
