const { AddedThread, NewThread } = require('../../../Domains/threads/entities')
const { ThreadRepository } = require('../../../Domains/threads')
const { AddThreadUseCase } = require('..')

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'title',
      body: 'body'
    }
    const authCredentials = { user: { id: 'user-1234' } }
    const expectedAddedThread = new AddedThread({
      id: 'thread-1234',
      title: useCasePayload.title,
      owner: authCredentials.user.id
    })

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()

    /** mocking needed function */
    mockThreadRepository.add = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedThread))

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const addedThread = await addThreadUseCase.execute(
      useCasePayload,
      authCredentials
    )

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread)
    expect(mockThreadRepository.add).toBeCalledWith(
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: authCredentials.user.id
      })
    )
  })
})
