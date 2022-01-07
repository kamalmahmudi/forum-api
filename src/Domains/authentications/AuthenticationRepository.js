class AuthenticationRepository {
  async add (token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async checkAvailability (token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async delete (token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = AuthenticationRepository
