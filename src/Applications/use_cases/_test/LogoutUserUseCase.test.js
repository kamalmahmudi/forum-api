const { AuthenticationRepository } = require('../../../Domains/authentications')
const { LogoutUserUseCase } = require('..')

describe('LogoutUserUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {}
    const logoutUserUseCase = new LogoutUserUseCase({})

    // Action & Assert
    await expect(
      logoutUserUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      'LOGOUT_USER_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
    )
  })

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 123
    }
    const logoutUserUseCase = new LogoutUserUseCase({})

    // Action & Assert
    await expect(
      logoutUserUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      'LOGOUT_USER_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken'
    }
    const mockAuthenticationRepository = new AuthenticationRepository()
    mockAuthenticationRepository.checkAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockAuthenticationRepository.delete = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository
    })

    // Action
    await logoutUserUseCase.execute(useCasePayload)

    // Assert
    expect(
      mockAuthenticationRepository.checkAvailability
    ).toHaveBeenCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationRepository.delete).toHaveBeenCalledWith(
      useCasePayload.refreshToken
    )
  })
})
