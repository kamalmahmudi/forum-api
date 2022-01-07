const { DetailedComment } = require('../../../Domains/comments/entities')
const { DetailedReply } = require('../../../Domains/replies/entities')
const { DetailedThread } = require('../../../Domains/threads/entities')
const { CommentRepository } = require('../../../Domains/comments')
const { ReplyRepository } = require('../../../Domains/replies')
const { ThreadRepository } = require('../../../Domains/threads')
const { GetThreadUseCase } = require('..')

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-1234'
    }
    const expectedDetailedThreadWithoutComments = new DetailedThread({
      id: useCasePayload.id,
      title: 'title',
      body: 'body',
      created_at: new Date(),
      username: 'username'
    })
    const expectedDetailedCommentWithoutReplies = new DetailedComment({
      id: 'comment-1234',
      content: 'content',
      created_at: new Date(),
      username: 'username'
    })
    const expectedDetailedReply = new DetailedReply({
      id: 'reply-1234',
      content: 'content',
      created_at: new Date(),
      username: 'username'
    })
    const expecectedDetailComment = new DetailedComment({
      ...expectedDetailedCommentWithoutReplies,
      created_at: expectedDetailedCommentWithoutReplies.date
    })
    expecectedDetailComment.setReplies([expectedDetailedReply])
    const expectedDetailedThread = new DetailedThread({
      ...expectedDetailedThreadWithoutComments,
      created_at: expectedDetailedThreadWithoutComments.date
    })
    expectedDetailedThread.setComments([expecectedDetailComment])

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository()
    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()

    /** mocking needed function */
    mockThreadRepository.find = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(expectedDetailedThreadWithoutComments)
      )
    mockCommentRepository.findAllByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([expectedDetailedCommentWithoutReplies])
      )
    mockReplyRepository.findAllByCommentIds = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({
          [expectedDetailedCommentWithoutReplies.id]: [expectedDetailedReply]
        })
      )

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    })

    // Action
    const detailedThread = await getThreadUseCase.execute(useCasePayload)

    // Assert
    expect(detailedThread).toStrictEqual(expectedDetailedThread)
    expect(mockThreadRepository.find).toBeCalledWith(useCasePayload.id)
    expect(mockCommentRepository.findAllByThreadId).toBeCalledWith(
      useCasePayload.id
    )
    expect(mockReplyRepository.findAllByCommentIds).toBeCalledWith([
      expectedDetailedCommentWithoutReplies.id
    ])
  })
})
