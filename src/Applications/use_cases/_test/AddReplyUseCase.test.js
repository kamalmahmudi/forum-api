const { CommentRepository } = require('../../../Domains/comments')
const { AddedReply, NewReply } = require('../../../Domains/replies/entities')
const { ReplyRepository } = require('../../../Domains/replies')
const { AddReplyUseCase } = require('..')

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
      threadId: 'thread-1234',
      commentId: 'thread-1234'
    }
    const authCredentials = { user: { id: 'user-1234' } }
    const expectedAddedReply = new AddedReply({
      id: 'reply-1234',
      content: useCasePayload.content,
      owner: authCredentials.user.id
    })

    const mockCommentRepository = new CommentRepository()
    mockCommentRepository.findByIdAndThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    const mockReplyRepository = new ReplyRepository()
    mockReplyRepository.add = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedReply))

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository
    })

    // Action
    const addedReply = await addReplyUseCase.execute(
      useCasePayload,
      authCredentials
    )

    // Assert
    expect(addedReply).toStrictEqual(expectedAddedReply)
    expect(mockCommentRepository.findByIdAndThreadId).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId
    )
    expect(mockReplyRepository.add).toBeCalledWith(
      new NewReply({
        content: useCasePayload.content,
        threadId: useCasePayload.threadId,
        commentId: useCasePayload.commentId,
        owner: authCredentials.user.id
      })
    )
  })
})
