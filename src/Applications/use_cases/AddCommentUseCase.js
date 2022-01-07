const { NewComment } = require('../../Domains/comments/entities')

class AddCommentUseCase {
  constructor ({ commentRepository }) {
    this._commentRepository = commentRepository
  }

  async execute (useCasePayload, authCredentials) {
    const newComment = new NewComment({
      ...useCasePayload,
      owner: authCredentials.user.id
    })
    return this._commentRepository.add(newComment)
  }
}

module.exports = AddCommentUseCase
