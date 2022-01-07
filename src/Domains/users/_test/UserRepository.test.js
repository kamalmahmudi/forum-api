const { UserRepository } = require('..')

describe('a UserRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const userRepository = new UserRepository()

    // Action and Assert
    await expect(userRepository.add({})).rejects.toThrowError(
      'USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(
      userRepository.verifyUsernameAvailability('')
    ).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(userRepository.getPasswordByUsername('')).rejects.toThrowError(
      'USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(userRepository.getIdByUsername('')).rejects.toThrowError(
      'USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
  })
})
