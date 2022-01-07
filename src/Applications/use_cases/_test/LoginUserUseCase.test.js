const { AuthenticationRepository } = require('../../../Domains/authentications')
const { NewAuth } = require('../../../Domains/authentications/entities')
const { UserRepository } = require('../../../Domains/users')
const { AuthenticationTokenManager, PasswordHash } = require('../../securities')
const { LoginUserUseCase } = require('..')

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'username',
      password: 'password'
    }
    const expectedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token'
    })
    const mockUserRepository = new UserRepository()
    const mockAuthenticationRepository = new AuthenticationRepository()
    const mockAuthenticationTokenManager = new AuthenticationTokenManager()
    const mockPasswordHash = new PasswordHash()

    // Mocking
    mockUserRepository.getPasswordByUsername = jest
      .fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'))
    mockPasswordHash.comparePassword = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockAuthenticationTokenManager.createAccessToken = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(expectedAuthentication.accessToken)
      )
    mockAuthenticationTokenManager.createRefreshToken = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(expectedAuthentication.refreshToken)
      )
    mockUserRepository.getIdByUsername = jest
      .fn()
      .mockImplementation(() => Promise.resolve('user-1234'))
    mockAuthenticationRepository.add = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    // create use case instance
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash
    })

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload)

    // Assert
    expect(actualAuthentication).toEqual(expectedAuthentication)
    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith('username')
    expect(mockPasswordHash.comparePassword).toBeCalledWith(
      'password',
      'encrypted_password'
    )
    expect(mockUserRepository.getIdByUsername).toBeCalledWith('username')
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({
      username: 'username',
      id: 'user-1234'
    })
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({
      username: 'username',
      id: 'user-1234'
    })
    expect(mockAuthenticationRepository.add).toBeCalledWith(
      expectedAuthentication.refreshToken
    )
  })
})
