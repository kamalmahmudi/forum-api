const { UsersTableTestHelper } = require('../../../../tests/helpers')
const { InvariantError } = require('../../../Commons/exceptions')
const {
  RegisteredUser,
  RegisterUser
} = require('../../../Domains/users/entities')
const pool = require('../../database/postgres/pool')
const { UserRepositoryPostgres } = require('..')

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('verifyUsernameAvailability function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'username' }) // memasukan user baru dengan username: username
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyUsernameAvailability('username')
      ).rejects.toThrowError(InvariantError)
    })

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyUsernameAvailability('username')
      ).resolves.not.toThrowError(InvariantError)
    })
  })

  describe('add function', () => {
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'username',
        password: 'secret_password',
        fullname: 'Full Name'
      })
      const fakeIdGenerator = () => '1234' // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      await userRepositoryPostgres.add(registerUser)

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-1234')
      expect(users).toHaveLength(1)
    })

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'username',
        password: 'secret_password',
        fullname: 'Full Name'
      })
      const fakeIdGenerator = () => '1234' // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      const registeredUser = await userRepositoryPostgres.add(registerUser)

      // Assert
      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: 'user-1234',
          username: 'username',
          fullname: 'Full Name'
        })
      )
    })
  })

  describe('getPasswordByUsername', () => {
    it('should throw InvariantError when user not found', () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

      // Action & Assert
      return expect(
        userRepositoryPostgres.getPasswordByUsername('username')
      ).rejects.toThrowError(InvariantError)
    })

    it('should return username password when user is found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})
      await UsersTableTestHelper.addUser({
        username: 'username',
        password: 'secret_password'
      })

      // Action & Assert
      const password = await userRepositoryPostgres.getPasswordByUsername(
        'username'
      )
      expect(password).toBe('secret_password')
    })
  })

  describe('getIdByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(
        userRepositoryPostgres.getIdByUsername('username')
      ).rejects.toThrowError(InvariantError)
    })

    it('should return user id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'username'
      })
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

      // Action
      const userId = await userRepositoryPostgres.getIdByUsername('username')

      // Assert
      expect(userId).toEqual('user-321')
    })
  })
})
