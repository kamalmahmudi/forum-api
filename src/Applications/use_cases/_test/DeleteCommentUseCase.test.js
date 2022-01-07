const { CommentRepository } = require('../../../Domains/comments')
const { DeleteCommentUseCase } = require('..')

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-1234',
      threadId: 'thread-1234'
    }
    const comment = { id: useCasePayload.commentId, owner: 'user-1234' }
    const authCredentials = { user: { id: 'user-1234' } }
    const mockCommentRepository = new CommentRepository()
    mockCommentRepository.findByIdAndThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(comment))
    mockCommentRepository.verifyOwnership = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.delete = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository
    })

    // Action
    await deleteCommentUseCase.execute(useCasePayload, authCredentials)

    // Assert
    expect(mockCommentRepository.findByIdAndThreadId).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId
    )
    expect(mockCommentRepository.verifyOwnership).toHaveBeenCalledWith(
      comment,
      authCredentials.user.id
    )
    expect(mockCommentRepository.delete).toHaveBeenCalledWith(
      useCasePayload.commentId
    )
  })
})
