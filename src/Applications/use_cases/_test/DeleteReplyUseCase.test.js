const { CommentRepository } = require('../../../Domains/comments')
const { ReplyRepository } = require('../../../Domains/replies')
const { DeleteReplyUseCase } = require('..')

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-1234',
      commentId: 'reply-1234',
      threadId: 'thread-1234'
    }
    const reply = { id: useCasePayload.replyId, owner: 'user-1234' }
    const authCredentials = { user: { id: 'user-1234' } }

    const mockCommentRepository = new CommentRepository()
    mockCommentRepository.findByIdAndThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    const mockReplyRepository = new ReplyRepository()
    mockReplyRepository.findByIdAndCommentId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(reply))
    mockReplyRepository.verifyOwnership = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.delete = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository
    })

    // Action
    await deleteReplyUseCase.execute(useCasePayload, authCredentials)

    // Assert
    expect(mockCommentRepository.findByIdAndThreadId).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId
    )
    expect(mockReplyRepository.findByIdAndCommentId).toHaveBeenCalledWith(
      useCasePayload.replyId,
      useCasePayload.commentId
    )
    expect(mockReplyRepository.verifyOwnership).toHaveBeenCalledWith(
      reply,
      authCredentials.user.id
    )
    expect(mockReplyRepository.delete).toHaveBeenCalledWith(
      useCasePayload.replyId
    )
  })
})
