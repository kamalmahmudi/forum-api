const { AddedComment, NewComment } = require('../../../Domains/comments/entities')
const { CommentRepository } = require('../../../Domains/comments')
const { AddCommentUseCase } = require('..')

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
      threadId: 'thread-1234'
    }
    const authCredentials = { user: { id: 'user-1234' } }
    const expectedAddedComment = new AddedComment({
      id: 'comment-1234',
      content: useCasePayload.content,
      owner: authCredentials.user.id
    })

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository()

    /** mocking needed function */
    mockCommentRepository.add = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment))

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository
    })

    // Action
    const addedComment = await addCommentUseCase.execute(
      useCasePayload,
      authCredentials
    )

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment)
    expect(mockCommentRepository.add).toBeCalledWith(
      new NewComment({
        content: useCasePayload.content,
        threadId: useCasePayload.threadId,
        owner: authCredentials.user.id
      })
    )
  })
})
