const { AuthenticationsTableTestHelper } = require('../../../../tests/helpers')
const { InvariantError } = require('../../../Commons/exceptions')
const pool = require('../../database/postgres/pool')
const { AuthenticationRepositoryPostgres } = require('..')

describe('AuthenticationRepository postgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('add function', () => {
    it('should add token to database', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(
        pool
      )
      const token = 'token'

      // Action
      await authenticationRepository.add(token)

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken(token)
      expect(tokens).toHaveLength(1)
      expect(tokens[0].token).toBe(token)
    })
  })

  describe('checkAvailability function', () => {
    it('should throw InvariantError if token not available', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(
        pool
      )
      const token = 'token'

      // Action & Assert
      await expect(
        authenticationRepository.checkAvailability(token)
      ).rejects.toThrow(InvariantError)
    })

    it('should not throw InvariantError if token available', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(
        pool
      )
      const token = 'token'
      await AuthenticationsTableTestHelper.addToken(token)

      // Action & Assert
      await expect(
        authenticationRepository.checkAvailability(token)
      ).resolves.not.toThrow(InvariantError)
    })
  })

  describe('delete', () => {
    it('should delete token from database', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(
        pool
      )
      const token = 'token'
      await AuthenticationsTableTestHelper.addToken(token)

      // Action
      await authenticationRepository.delete(token)

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken(token)
      expect(tokens).toHaveLength(0)
    })
  })
})
