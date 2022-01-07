const { NewThread } = require('../../Domains/threads/entities')

class AddThreadUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload, authCredentials) {
    const newThread = new NewThread({
      ...useCasePayload,
      owner: authCredentials.user.id
    })
    return this._threadRepository.add(newThread)
  }
}

module.exports = AddThreadUseCase
