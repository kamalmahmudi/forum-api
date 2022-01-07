const {
  RegisteredUser,
  RegisterUser
} = require('../../../Domains/users/entities')
const { UserRepository } = require('../../../Domains/users')
const { PasswordHash } = require('../../securities')
const { AddUserUseCase } = require('..')

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'username',
      password: 'password',
      fullname: 'Full Name'
    }
    const expectedRegisteredUser = new RegisteredUser({
      id: 'user-1234',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname
    })

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository()
    const mockPasswordHash = new PasswordHash()

    /** mocking needed function */
    mockUserRepository.verifyUsernameAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockPasswordHash.hash = jest
      .fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'))
    mockUserRepository.add = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedRegisteredUser))

    /** creating use case instance */
    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash
    })

    // Action
    const registeredUser = await addUserUseCase.execute(useCasePayload)

    // Assert
    expect(registeredUser).toStrictEqual(expectedRegisteredUser)
    expect(mockUserRepository.verifyUsernameAvailability).toBeCalledWith(
      useCasePayload.username
    )
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password)
    expect(mockUserRepository.add).toBeCalledWith(
      new RegisterUser({
        username: useCasePayload.username,
        password: 'encrypted_password',
        fullname: useCasePayload.fullname
      })
    )
  })
})
