const { NotFoundError } = require('../../../Commons/exceptions')
const { CommentRepository } = require('../../../Domains/comments')
const { NewLike } = require('../../../Domains/likes/entities')
const { LikeRepository } = require('../../../Domains/likes')
const { ToggleLikeUseCase } = require('..')

describe('ToggleLikeUseCase', () => {
  it('should orchestrating the toggle like action to add a like correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-1234',
      commentId: 'thread-1234'
    }
    const authCredentials = { user: { id: 'user-1234' } }

    const mockCommentRepository = new CommentRepository()
    mockCommentRepository.findByIdAndThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    const mockLikeRepository = new LikeRepository()
    mockLikeRepository.deleteByCommentIdAndOwner = jest
      .fn()
      .mockImplementation(() => Promise.reject(NotFoundError()))

    mockLikeRepository.add = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    /** creating use case instance */
    const toggleLikeUseCase = new ToggleLikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository
    })

    // Action
    const isSuccess = await toggleLikeUseCase.execute(
      useCasePayload,
      authCredentials
    )

    // Assert
    expect(isSuccess).toStrictEqual(isSuccess)
    expect(mockCommentRepository.findByIdAndThreadId).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId
    )
    expect(mockLikeRepository.deleteByCommentIdAndOwner).toBeCalledWith(
      useCasePayload.commentId,
      authCredentials.user.id
    )
    expect(mockLikeRepository.add).toBeCalledWith(
      new NewLike({
        threadId: useCasePayload.threadId,
        commentId: useCasePayload.commentId,
        owner: authCredentials.user.id
      })
    )
  })

  it('should orchestrating the toggle like action to remove a like correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-1234',
      commentId: 'thread-1234'
    }
    const authCredentials = { user: { id: 'user-1234' } }

    const mockCommentRepository = new CommentRepository()
    mockCommentRepository.findByIdAndThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    const mockLikeRepository = new LikeRepository()
    mockLikeRepository.deleteByCommentIdAndOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    mockLikeRepository.add = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    /** creating use case instance */
    const toggleLikeUseCase = new ToggleLikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository
    })

    // Action
    const isSuccess = await toggleLikeUseCase.execute(
      useCasePayload,
      authCredentials
    )

    // Assert
    expect(isSuccess).toStrictEqual(isSuccess)
    expect(mockCommentRepository.findByIdAndThreadId).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId
    )
    expect(mockLikeRepository.deleteByCommentIdAndOwner).toBeCalledWith(
      useCasePayload.commentId,
      authCredentials.user.id
    )
    expect(mockLikeRepository.add).not.toBeCalled()
  })
})
