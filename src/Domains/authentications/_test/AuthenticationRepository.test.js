const { AuthenticationRepository } = require('..')

describe('an AuthenticationRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const authenticationRepository = new AuthenticationRepository()

    // Action & Assert
    await expect(authenticationRepository.add('')).rejects.toThrowError(
      'AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(
      authenticationRepository.checkAvailability('')
    ).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(authenticationRepository.delete('')).rejects.toThrowError(
      'AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
  })
})
