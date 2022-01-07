const { RegisterUser } = require('../../Domains/users/entities')

class AddUserUseCase {
  constructor ({ userRepository, passwordHash }) {
    this._userRepository = userRepository
    this._passwordHash = passwordHash
  }

  async execute (useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload)
    await this._userRepository.verifyUsernameAvailability(registerUser.username)
    registerUser.password = await this._passwordHash.hash(registerUser.password)
    return this._userRepository.add(registerUser)
  }
}

module.exports = AddUserUseCase
